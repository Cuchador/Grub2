from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
import pandas as pd
from numpy.linalg import norm
import numpy as np
import ast  

import openai
import time


def cosine_sim(vec1, vec2):
    sim = 0
    if norm(vec1) != 0 and norm(vec2) != 0:
        sim = np.dot(vec1, vec2) / (norm(vec1) * norm(vec2))
    return sim

def openAiMovieRequest(food, genres, decades, popularities, only_gpt, movie_names=[]):
    message = 'Suggest a movie that has the same vibe as ' + food
    if (only_gpt):
        if (genres):
            message += ' belonging to the genre(s) ' + ', '.join(str(genre) for genre in genres)
        if (decades):
            message += ' released in the decade(s) ' + ', '.join(str(decade) for decade in decades)
        if (popularities):
            message += ' with popularity level(s) ' + ', '.join(str(pop) for pop in popularities)
            message += " where 1 is NOT a popular movie, and 5 is the most popular movie in that genre"
        if (movie_names):
            message += " different from the movie(s) " + ', '.join(str(movie_names) for name in movie_names)
    
    message += '. Send the response in the format: "Name (year)" where Name is the name of the movie and year is the year that movie was released'
    message += ' and include absolutely nothing else in your response.'
    openai.api_key= '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'
    try:
        SYSTEM_PROMPT = f"""You are a movie reccomendation AI assistant.
        You will be given a food and (optionally) sets of one or more genres, decades,
        and popularity levels, where 5 is very popular, and 1 is not popular at all.
       """
        chat_completion = openai.ChatCompletion.create(model = 'gpt-3.5-turbo',messages=[
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': message}]
                                                       )
        content = chat_completion['choices'][0]['message']['content']
        return content
    except openai.error.ServiceUnavailableError as e:
        print(f"ServiceUnavailableError: {e}")
        print("Retrying after a delay...")
        time.sleep(5)  # Wait for 5 seconds before retrying
        return openAiMovieRequest(food, genres, decades, popularities, only_gpt)


#gets range of frequencies to include in filtering
def getPopularityThresholds(popularities):
    freq_thresholds = pd.read_csv('public/FreqThresholds.csv')
    freq_thresholds.set_index('Popularity', inplace=True)
    thresholds = []
    for pop in popularities:
        pop = int(pop)
        lower_bound = freq_thresholds.loc[pop]['Frequency']
        if pop == 5:
            upper_bound = 99999
        else:
            upper_bound = freq_thresholds.loc[pop + 1]['Frequency']
    
        threshold = (lower_bound, upper_bound)
        thresholds.append(threshold)

    return thresholds

    



app = Flask(__name__)
CORS(app)


@app.route('/api/generate-movies', methods=['POST'])
def generate_movies():

   

    data = request.get_json()
    
    #gets selected food item
    selected_food = data['selectedFood']
    selected_genres = data['selectedGenres']
    selected_years = data['selectedYears']
    selected_popularities = data['selectedPopularities']
    only_gpt = data['onlyGPT']
    print(only_gpt)
    

    #gets decades as integers
    selected_years = [int(year) for year in selected_years]
    
    movie = openAiMovieRequest(selected_food, selected_genres, selected_years, selected_popularities, only_gpt)
    

    #gets mappings to movie
    #mappings = pd.read_csv('public/mappings.csv')

    #gets initial movie from mapping
    # row = mappings[mappings['food'] == selected_food]
    # movie = row['movie'].iloc[0]

   

    #creates dataframe for movie data
    movies = pd.read_csv('public/movies.csv')
    movies.set_index('movieId', inplace=True)
    movies['genres'] = movies['genres'].apply(ast.literal_eval)


    movie = ''
    #gets movie that is in the dataset
    while not (movie in movies['title'].values):
        #bypasses mappings and goes straight to chat gpt
        movie = openAiMovieRequest(selected_food, selected_genres, selected_years, selected_popularities, only_gpt)
    #print(movie)
    
    movie_names = []
    if (not only_gpt):
        #creates data frame for latent factors
        lf_matrix = pd.read_csv('public/movie_latent_factors.csv', header=None).values.tolist()

        #gets latent vector for inial movie
        movie_index = movies.loc[movies['title'] == movie].index[0]
        movie_vec = np.array(lf_matrix[movie_index])

        #gets subset of movies captured by filters

        thresholds = getPopularityThresholds(selected_popularities)

        genres_filter = (len(selected_genres) == 0) | (movies['genres'].apply(lambda x: any(genre in x for genre in selected_genres)))
        decades_filter = (len(selected_years) == 0) | (movies['year'].apply(lambda x: any(x >= decade and x < decade + 10 for decade in selected_years)))
        popularity_filter = (len(thresholds) == 0) | movies['freq'].apply(lambda x: any(lower <= x < upper for lower, upper in thresholds))


        filtered_movies = movies[genres_filter & decades_filter & popularity_filter]

        #gets cosine similarity for each movie
        sim_list = []
        movie_list = []
        for id in filtered_movies.index:
            movie_vec2 = lf_matrix[id]
            sim = cosine_sim(movie_vec, movie_vec2)
            sim_list.append(sim)
            movie_list.append(id)

        #sorts based on cosine similarity
        combined_lists = list(zip(sim_list, movie_list))
        sorted_combined_lists = sorted(combined_lists, key=lambda x: x[0], reverse = True)
        sim_list, movie_list = zip(*sorted_combined_lists)

        #gets top 3 recommendations
        for i in range(3):
            movie_names.append(movies.loc[movie_list[i]]['title'])
    else:
        movie = ''
        for i in range(3):
            #bypasses mappings and goes straight to chat gpt
            movie = openAiMovieRequest(selected_food, selected_genres, selected_years, selected_popularities, only_gpt, movie_names)
            print(movie)
            movie_names.append(movie)
    #generates the response
    response = jsonify({'recommendations': movie_names})

    return response





if __name__ == '__main__':
    app.run(debug=True)
