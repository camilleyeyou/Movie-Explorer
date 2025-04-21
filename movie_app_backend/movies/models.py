from bson import ObjectId
from .mongodb import mongodb
from django.conf import settings
import requests
from typing import Dict, List, Any, Union, Optional


class MovieManager:
    
    @staticmethod
    def get_tmdb_data(endpoint: str, params: Dict = None) -> Dict:
        
        if params is None:
            params = {}
            
        params['api_key'] = settings.TMDB_API_KEY
        
        url = f"{settings.TMDB_API_BASE_URL}/{endpoint}"
        response = requests.get(url, params=params)
        
        response.raise_for_status()
        
        return response.json()
    
    @staticmethod
    def get_popular_movies(page: int = 1) -> List[Dict]:
        
        data = MovieManager.get_tmdb_data('movie/popular', {'page': page, 'language': 'en-US'})
        
        movies = []
        for movie_data in data.get('results', []):
            existing_movie = mongodb.movies.find_one({'tmdb_id': movie_data['id']})
            
            if existing_movie:
                mongodb.movies.update_one(
                    {'tmdb_id': movie_data['id']},
                    {'$set': MovieManager._process_movie_data(movie_data)}
                )
                movie_id = existing_movie['_id']
            else:
                processed_data = MovieManager._process_movie_data(movie_data)
                result = mongodb.movies.insert_one(processed_data)
                movie_id = result.inserted_id
            
            movie = mongodb.movies.find_one({'_id': movie_id})
            movie['_id'] = str(movie['_id'])  
            movies.append(movie)
        
        return movies
    
    @classmethod
    def get_top_rated_movies(cls, page=1):
        
        try:
            from .tmdb import TMDBClient
            tmdb_client = TMDBClient()
            
            response = tmdb_client.get_top_rated_movies(page=page)
            
            movies = []
            for movie_data in response.get('results', []):
                existing_movie = mongodb.movies.find_one({'tmdb_id': movie_data['id']})
                
                if existing_movie:
                    mongodb.movies.update_one(
                        {'tmdb_id': movie_data['id']},
                        {'$set': MovieManager._process_movie_data(movie_data)}
                    )
                    movie_id = existing_movie['_id']
                else:
                    processed_data = MovieManager._process_movie_data(movie_data)
                    result = mongodb.movies.insert_one(processed_data)
                    movie_id = result.inserted_id
                
                movie = mongodb.movies.find_one({'_id': movie_id})
                movie['_id'] = str(movie['_id']) 
                movies.append(movie)
            
            return {
                'results': movies,
                'page': response.get('page', 1),
                'total_pages': response.get('total_pages', 1),
                'total_results': response.get('total_results', 0)
            }
            
        except Exception as e:
            print(f"Error getting top rated movies: {str(e)}")
            raise
    
    @classmethod
    def get_now_playing_movies(cls, page=1):
        try:
            from .tmdb import TMDBClient
            tmdb_client = TMDBClient()
            
            response = tmdb_client.get_now_playing_movies(page=page)
            
            movies = []
            for movie_data in response.get('results', []):
                existing_movie = mongodb.movies.find_one({'tmdb_id': movie_data['id']})
                
                if existing_movie:
                    mongodb.movies.update_one(
                        {'tmdb_id': movie_data['id']},
                        {'$set': MovieManager._process_movie_data(movie_data)}
                    )
                    movie_id = existing_movie['_id']
                else:
                    processed_data = MovieManager._process_movie_data(movie_data)
                    result = mongodb.movies.insert_one(processed_data)
                    movie_id = result.inserted_id
                
                movie = mongodb.movies.find_one({'_id': movie_id})
                movie['_id'] = str(movie['_id']) 
                movies.append(movie)
            
            return {
                'results': movies,
                'page': response.get('page', 1),
                'total_pages': response.get('total_pages', 1),
                'total_results': response.get('total_results', 0)
            }
            
        except Exception as e:
            print(f"Error getting now playing movies: {str(e)}")
            raise
    
    @classmethod
    def get_upcoming_movies(cls, page=1):
        
        try:
            from .tmdb import TMDBClient
            tmdb_client = TMDBClient()
            
            response = tmdb_client.get_upcoming_movies(page=page)
            
            movies = []
            for movie_data in response.get('results', []):
                existing_movie = mongodb.movies.find_one({'tmdb_id': movie_data['id']})
                
                if existing_movie:
                    mongodb.movies.update_one(
                        {'tmdb_id': movie_data['id']},
                        {'$set': MovieManager._process_movie_data(movie_data)}
                    )
                    movie_id = existing_movie['_id']
                else:
                    processed_data = MovieManager._process_movie_data(movie_data)
                    result = mongodb.movies.insert_one(processed_data)
                    movie_id = result.inserted_id
                
                movie = mongodb.movies.find_one({'_id': movie_id})
                movie['_id'] = str(movie['_id'])  
                movies.append(movie)
            
            return {
                'results': movies,
                'page': response.get('page', 1),
                'total_pages': response.get('total_pages', 1),
                'total_results': response.get('total_results', 0)
            }
            
        except Exception as e:
            print(f"Error getting upcoming movies: {str(e)}")
            raise
    
    @staticmethod
    def get_movie_details(tmdb_id: int) -> Dict:
        
        movie_data = MovieManager.get_tmdb_data(f'movie/{tmdb_id}', {'language': 'en-US', 'append_to_response': 'credits,videos,recommendations'})
        
        existing_movie = mongodb.movies.find_one({'tmdb_id': movie_data['id']})
        
        processed_data = MovieManager._process_movie_data(movie_data, include_details=True)
        
        if existing_movie:
            mongodb.movies.update_one(
                {'tmdb_id': movie_data['id']},
                {'$set': processed_data}
            )
            movie_id = existing_movie['_id']
        else:
            result = mongodb.movies.insert_one(processed_data)
            movie_id = result.inserted_id
        
        movie = mongodb.movies.find_one({'_id': movie_id})
        movie['_id'] = str(movie['_id']) 
        
        return movie
    
    @staticmethod
    def search_movies(query: str, page: int = 1) -> List[Dict]:
        
        data = MovieManager.get_tmdb_data('search/movie', {'query': query, 'page': page, 'language': 'en-US'})
        
        movies = []
        for movie_data in data.get('results', []):
            existing_movie = mongodb.movies.find_one({'tmdb_id': movie_data['id']})
            
            if existing_movie:
                mongodb.movies.update_one(
                    {'tmdb_id': movie_data['id']},
                    {'$set': MovieManager._process_movie_data(movie_data)}
                )
                movie_id = existing_movie['_id']
            else:
                processed_data = MovieManager._process_movie_data(movie_data)
                result = mongodb.movies.insert_one(processed_data)
                movie_id = result.inserted_id
            
            movie = mongodb.movies.find_one({'_id': movie_id})
            movie['_id'] = str(movie['_id'])  
            movies.append(movie)
        
        return movies
    
    @staticmethod
    def _process_movie_data(movie_data: Dict, include_details: bool = False) -> Dict:
        
        base_url = "https://image.tmdb.org/t/p/"
        
        processed_data = {
            'tmdb_id': movie_data['id'],
            'title': movie_data['title'],
            'overview': movie_data.get('overview', ''),
            'poster_path': f"{base_url}w500{movie_data['poster_path']}" if movie_data.get('poster_path') else None,
            'backdrop_path': f"{base_url}original{movie_data['backdrop_path']}" if movie_data.get('backdrop_path') else None,
            'release_date': movie_data.get('release_date', ''),
            'vote_average': movie_data.get('vote_average', 0),
            'vote_count': movie_data.get('vote_count', 0),
            'popularity': movie_data.get('popularity', 0),
            'original_language': movie_data.get('original_language', ''),
            'genre_ids': movie_data.get('genre_ids', []),
        }
        
        if include_details:
            if 'genres' in movie_data:
                processed_data['genres'] = movie_data['genres']
                
            additional_fields = [
                'runtime', 'budget', 'revenue', 'status', 'tagline',
                'imdb_id', 'homepage', 'production_companies',
                'production_countries', 'spoken_languages'
            ]
            
            for field in additional_fields:
                if field in movie_data:
                    processed_data[field] = movie_data[field]
            
            if 'credits' in movie_data:
                if 'cast' in movie_data['credits']:
                    processed_data['cast'] = [
                        {
                            'id': person['id'],
                            'name': person['name'],
                            'character': person['character'],
                            'profile_path': f"{base_url}w185{person['profile_path']}" if person.get('profile_path') else None,
                            'order': person['order']
                        }
                        for person in movie_data['credits']['cast'][:20]  
                    ]
                
                if 'crew' in movie_data['credits']:
                    key_positions = ['Director', 'Writer', 'Screenplay', 'Producer', 'Executive Producer']
                    processed_data['crew'] = [
                        {
                            'id': person['id'],
                            'name': person['name'],
                            'job': person['job'],
                            'department': person['department'],
                            'profile_path': f"{base_url}w185{person['profile_path']}" if person.get('profile_path') else None
                        }
                        for person in movie_data['credits']['crew']
                        if person['job'] in key_positions
                    ]
            
            if 'videos' in movie_data and 'results' in movie_data['videos']:
                videos = [
                    {
                        'id': video['id'],
                        'key': video['key'],
                        'name': video['name'],
                        'site': video['site'],
                        'type': video['type'],
                        'official': video.get('official', True)
                    }
                    for video in movie_data['videos']['results']
                    if video['site'] == 'YouTube' and video['type'] in ['Trailer', 'Teaser']
                ]
                processed_data['videos'] = videos
            
            if 'recommendations' in movie_data and 'results' in movie_data['recommendations']:
                recommendations = [
                    {
                        'id': movie['id'],
                        'title': movie['title'],
                        'poster_path': f"{base_url}w185{movie['poster_path']}" if movie.get('poster_path') else None,
                        'vote_average': movie.get('vote_average', 0)
                    }
                    for movie in movie_data['recommendations']['results'][:10]  
                ]
                processed_data['recommendations'] = recommendations
        
        return processed_data


class UserMovieManager:
    
    
    @staticmethod
    def get_user_movie_data(user_id: int, tmdb_id: int = None) -> Union[Dict, List[Dict]]:
       
        if tmdb_id:
            data = mongodb.user_movie_data.find_one({'user_id': user_id, 'tmdb_id': tmdb_id})
            if data:
                data['_id'] = str(data['_id'])  
            return data
        else:
            cursor = mongodb.user_movie_data.find({'user_id': user_id})
            result = []
            for item in cursor:
                item['_id'] = str(item['_id']) 
                result.append(item)
            return result
    
    @staticmethod
    def toggle_favorite(user_id: int, tmdb_id: int) -> Dict:
       
        data = mongodb.user_movie_data.find_one({'user_id': user_id, 'tmdb_id': tmdb_id})
        
        if data:
            new_status = not data.get('favorite', False)
            mongodb.user_movie_data.update_one(
                {'_id': data['_id']},
                {'$set': {'favorite': new_status}}
            )
            data['favorite'] = new_status
        else:
            data = {
                'user_id': user_id,
                'tmdb_id': tmdb_id,
                'favorite': True,
                'watchlist': False,
                'watched': False,
                'rating': None
            }
            result = mongodb.user_movie_data.insert_one(data)
            data['_id'] = result.inserted_id
        
        data['_id'] = str(data['_id'])  
        return data
    
    @staticmethod
    def toggle_watchlist(user_id: int, tmdb_id: int) -> Dict:
        
        data = mongodb.user_movie_data.find_one({'user_id': user_id, 'tmdb_id': tmdb_id})
        
        if data:
            new_status = not data.get('watchlist', False)
            mongodb.user_movie_data.update_one(
                {'_id': data['_id']},
                {'$set': {'watchlist': new_status}}
            )
            data['watchlist'] = new_status
        else:
            data = {
                'user_id': user_id,
                'tmdb_id': tmdb_id,
                'favorite': False,
                'watchlist': True,
                'watched': False,
                'rating': None
            }
            result = mongodb.user_movie_data.insert_one(data)
            data['_id'] = result.inserted_id
        
        data['_id'] = str(data['_id'])  
        return data
    
    @staticmethod
    def toggle_watched(user_id: int, tmdb_id: int) -> Dict:
       
        data = mongodb.user_movie_data.find_one({'user_id': user_id, 'tmdb_id': tmdb_id})
        
        if data:
            new_status = not data.get('watched', False)
            mongodb.user_movie_data.update_one(
                {'_id': data['_id']},
                {'$set': {'watched': new_status}}
            )
            data['watched'] = new_status
        else:
            data = {
                'user_id': user_id,
                'tmdb_id': tmdb_id,
                'favorite': False,
                'watchlist': False,
                'watched': True,
                'rating': None
            }
            result = mongodb.user_movie_data.insert_one(data)
            data['_id'] = result.inserted_id
        
        data['_id'] = str(data['_id'])  
        return data
    
    @staticmethod
    def rate_movie(user_id: int, tmdb_id: int, rating: float) -> Dict:
       
        if rating < 0 or rating > 10:
            raise ValueError("Rating must be between 0 and 10")
        
        data = mongodb.user_movie_data.find_one({'user_id': user_id, 'tmdb_id': tmdb_id})
        
        if data:
            mongodb.user_movie_data.update_one(
                {'_id': data['_id']},
                {'$set': {'rating': rating}}
            )
            data['rating'] = rating
        else:
            data = {
                'user_id': user_id,
                'tmdb_id': tmdb_id,
                'favorite': False,
                'watchlist': False,
                'watched': True,  
                'rating': rating
            }
            result = mongodb.user_movie_data.insert_one(data)
            data['_id'] = result.inserted_id
        
        data['_id'] = str(data['_id'])  
        return data
    
    @staticmethod
    def get_favorites(user_id: int) -> List[Dict]:
        cursor = mongodb.user_movie_data.find({'user_id': user_id, 'favorite': True})
        
        favorites = []
        for item in cursor:
            movie = mongodb.movies.find_one({'tmdb_id': item['tmdb_id']})
            if movie:
                movie['_id'] = str(movie['_id'])
                movie['user_data'] = {
                    'favorite': item.get('favorite', False),
                    'watchlist': item.get('watchlist', False),
                    'watched': item.get('watched', False),
                    'rating': item.get('rating')
                }
                favorites.append(movie)
        
        return favorites
    
    @staticmethod
    def get_watchlist(user_id: int) -> List[Dict]:
       
        cursor = mongodb.user_movie_data.find({'user_id': user_id, 'watchlist': True})
        
        watchlist = []
        for item in cursor:
            movie = mongodb.movies.find_one({'tmdb_id': item['tmdb_id']})
            if movie:
                movie['_id'] = str(movie['_id'])
                movie['user_data'] = {
                    'favorite': item.get('favorite', False),
                    'watchlist': item.get('watchlist', False),
                    'watched': item.get('watched', False),
                    'rating': item.get('rating')
                }
                watchlist.append(movie)
        
        return watchlist
    
    @staticmethod
    def get_watched(user_id: int) -> List[Dict]:
       
        cursor = mongodb.user_movie_data.find({'user_id': user_id, 'watched': True})
        
        watched = []
        for item in cursor:
            movie = mongodb.movies.find_one({'tmdb_id': item['tmdb_id']})
            if movie:
                movie['_id'] = str(movie['_id'])
                movie['user_data'] = {
                    'favorite': item.get('favorite', False),
                    'watchlist': item.get('watchlist', False),
                    'watched': item.get('watched', False),
                    'rating': item.get('rating')
                }
                watched.append(movie)
        
        return watched
    
    @staticmethod
    def get_rated(user_id: int) -> List[Dict]:
        
        cursor = mongodb.user_movie_data.find({
            'user_id': user_id,
            'rating': {'$ne': None}
        })
        
        rated = []
        for item in cursor:
            movie = mongodb.movies.find_one({'tmdb_id': item['tmdb_id']})
            if movie:
                movie['_id'] = str(movie['_id'])
                movie['user_data'] = {
                    'favorite': item.get('favorite', False),
                    'watchlist': item.get('watchlist', False),
                    'watched': item.get('watched', False),
                    'rating': item.get('rating')
                }
                rated.append(movie)
        
        return rated