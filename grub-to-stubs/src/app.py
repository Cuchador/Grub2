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

    #gets cosine similarity for each movie
    sim_list = []
    movie_list = []
    for id in movies.index:
        movie_vec2 = lf_matrix[id]
        sim = cosine_sim(movie_vec, movie_vec2)
        sim_list.append(sim)
        movie_list.append(id)

    #sorts based on cosine similarity
    combined_lists = list(zip(sim_list, movie_list))
    sorted_combined_lists = sorted(combined_lists, key=lambda x: x[0], reverse = True)
    sim_list, movie_list = zip(*sorted_combined_lists)

    print("The 3 highest ranked for the query are: ")
    movie_names = []
    for i in range(3):
        print(sim_list[i], '|', movies.loc[movie_list[i]]['title'])
        movie_names.append(movies.loc[movie_list[i]]['title'])

    #generates the response
    response = jsonify({'recommendations': movie_names})

    return response





if __name__ == '__main__':
    app.run(debug=True)
