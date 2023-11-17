from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
import pandas as pd


app = Flask(__name__)
CORS(app)


@app.route('/api/generate-movies', methods=['POST'])
def generate_movies():

    data = request.get_json()
    
    selected_food = data['selectedFood']
    mappings = pd.read_csv('../public/mappings.csv')

    row = mappings[mappings['food'] == selected_food]
    movie = row['movie'].iloc[0]

    
   

    # Call your Python script function with selected_food
    recommendations = movie

    # Generate the response
    response = jsonify({'recommendations': recommendations})

    return response





if __name__ == '__main__':
    app.run(debug=True)
