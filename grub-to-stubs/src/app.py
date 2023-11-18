from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
import pandas as pd
from numpy.linalg import norm
import numpy as np
import ast  

def cosine_sim(vec1, vec2):
    sim = 0
    if norm(vec1) != 0 and norm(vec2) != 0:
        sim = np.dot(vec1, vec2) / (norm(vec1) * norm(vec2))
    return sim



app = Flask(__name__)
CORS(app)


@app.route('/api/generate-movies', methods=['POST'])
def generate_movies():

    data = request.get_json()
    
    #gets selected food item
    selected_food = data['selectedFood']

    selected_genres = data['selectedGenres']
    selected_years = data['selectedYears']

    #gets decades as integers
    selected_years = [int(year.replace('s', '')) for year in selected_years]

    #gets mappings to movie
    mappings = pd.read_csv('../public/mappings.csv')

    #gets initial movie from mapping
    row = mappings[mappings['food'] == selected_food]
    movie = row['movie'].iloc[0]

    #creates dataframe for movie data
    movies = pd.read_csv('../public/movies.csv')
    movies.set_index('movieId', inplace=True)
    movies['genres'] = movies['genres'].apply(ast.literal_eval)

    #creates data frame for latent factors
    lf_matrix = pd.read_csv('../public/movie_latent_factors.csv', header=None).values.tolist()

    #gets latent vector for inial movie
    movie_index = movies.loc[movies['title'] == movie].index[0]
    movie_vec = np.array(lf_matrix[movie_index])

    #gets subset of movies captured by filters
    genres_filter = (len(selected_genres) == 0) | (movies['genres'].apply(lambda x: any(genre in x for genre in selected_genres)))
    decades_filter = (len(selected_years) == 0) | (movies['year'].apply(lambda x: any(x >= decade and x < decade + 10 for decade in selected_years)))

    filtered_movies = movies[genres_filter & decades_filter]

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
    movie_names = []
    for i in range(3):
        movie_names.append(movies.loc[movie_list[i]]['title'])

    #generates the response
    response = jsonify({'recommendations': movie_names})

    return response





if __name__ == '__main__':
    app.run(debug=True)
