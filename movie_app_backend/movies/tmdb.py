import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class TMDBClient:
    
    
    BASE_URL = "https://api.themoviedb.org/3"
    
    def __init__(self):
        self.api_key = settings.TMDB_API_KEY
        
    def _make_request(self, endpoint, params=None):
        
        if params is None:
            params = {}
            
        params['api_key'] = self.api_key
        
        url = f"{self.BASE_URL}/{endpoint}"
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"TMDB API request failed: {str(e)}")
            raise
            
    def get_popular_movies(self, page=1):
       
        return self._make_request("movie/popular", {"page": page})
    
    def get_top_rated_movies(self, page=1):
        
        return self._make_request("movie/top_rated", {"page": page})
    
    def get_now_playing_movies(self, page=1):
        
        return self._make_request("movie/now_playing", {"page": page})
    
    def get_upcoming_movies(self, page=1):
        
        return self._make_request("movie/upcoming", {"page": page})
    
    def search_movies(self, query, page=1):
        
        return self._make_request("search/movie", {"query": query, "page": page})
    
    def get_movie_details(self, movie_id):
        
        return self._make_request(f"movie/{movie_id}")
    

    def get_now_playing(self, page=1):
        
        return self._make_request("movie/now_playing", {"page": page})

    def get_upcoming(self, page=1):
        
        return self._make_request("movie/upcoming", {"page": page})
    
    def get_top_rated(self, page=1):
       
        return self._make_request("movie/top_rated", {"page": page})