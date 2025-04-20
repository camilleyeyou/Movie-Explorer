from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.http import Http404

from .models import MovieManager, UserMovieManager
from .serializers import MovieSerializer, UserMovieDataSerializer, RatingSerializer
from .tmdb import TMDBClient


class StandardResultsSetPagination(PageNumberPagination):
    
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class PopularMoviesView(APIView):
   
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get(self, request):
        page = int(request.query_params.get('page', 1))
        movies = MovieManager.get_popular_movies(page=page)
        
        for movie in movies:
            user_data = UserMovieManager.get_user_movie_data(request.user.id, movie['tmdb_id'])
            if user_data:
                movie['user_data'] = {
                    'favorite': user_data.get('favorite', False),
                    'watchlist': user_data.get('watchlist', False),
                    'watched': user_data.get('watched', False),
                    'rating': user_data.get('rating')
                }
        
        serializer = MovieSerializer(movies, many=True)
        
        paginator = self.pagination_class()
        paginated_data = paginator.paginate_queryset(serializer.data, request)
        
        return paginator.get_paginated_response(paginated_data)


class MovieSearchView(APIView):
   
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get(self, request):
        query = request.query_params.get('query', '')
        page = int(request.query_params.get('page', 1))
        
        if not query:
            return Response(
                {"error": "Search query is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        movies = MovieManager.search_movies(query=query, page=page)
        
        for movie in movies:
            user_data = UserMovieManager.get_user_movie_data(request.user.id, movie['tmdb_id'])
            if user_data:
                movie['user_data'] = {
                    'favorite': user_data.get('favorite', False),
                    'watchlist': user_data.get('watchlist', False),
                    'watched': user_data.get('watched', False),
                    'rating': user_data.get('rating')
                }
        
        serializer = MovieSerializer(movies, many=True)
        
        paginator = self.pagination_class()
        paginated_data = paginator.paginate_queryset(serializer.data, request)
        
        return paginator.get_paginated_response(paginated_data)


class MovieDetailView(APIView):
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, tmdb_id):
        try:
            movie = MovieManager.get_movie_details(tmdb_id)
            
            user_data = UserMovieManager.get_user_movie_data(request.user.id, movie['tmdb_id'])
            if user_data:
                movie['user_data'] = {
                    'favorite': user_data.get('favorite', False),
                    'watchlist': user_data.get('watchlist', False),
                    'watched': user_data.get('watched', False),
                    'rating': user_data.get('rating')
                }
            
            serializer = MovieSerializer(movie)
            
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_404_NOT_FOUND
            )


class FavoriteMoviesView(APIView):
   
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get(self, request):
        movies = UserMovieManager.get_favorites(request.user.id)
        
        serializer = MovieSerializer(movies, many=True)
        
        paginator = self.pagination_class()
        paginated_data = paginator.paginate_queryset(serializer.data, request)
        
        return paginator.get_paginated_response(paginated_data)


class WatchlistMoviesView(APIView):
   
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get(self, request):
        movies = UserMovieManager.get_watchlist(request.user.id)
        
        serializer = MovieSerializer(movies, many=True)
        
        paginator = self.pagination_class()
        paginated_data = paginator.paginate_queryset(serializer.data, request)
        
        return paginator.get_paginated_response(paginated_data)


class WatchedMoviesView(APIView):
   
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get(self, request):
        movies = UserMovieManager.get_watched(request.user.id)
        
        serializer = MovieSerializer(movies, many=True)
        
        paginator = self.pagination_class()
        paginated_data = paginator.paginate_queryset(serializer.data, request)
        
        return paginator.get_paginated_response(paginated_data)


class RatedMoviesView(APIView):
    
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get(self, request):
        movies = UserMovieManager.get_rated(request.user.id)
        
        serializer = MovieSerializer(movies, many=True)
        
        paginator = self.pagination_class()
        paginated_data = paginator.paginate_queryset(serializer.data, request)
        
        return paginator.get_paginated_response(paginated_data)


class ToggleFavoriteView(APIView):
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, tmdb_id):
        try:
            data = UserMovieManager.toggle_favorite(request.user.id, tmdb_id)
            
            serializer = UserMovieDataSerializer(data)
            
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ToggleWatchlistView(APIView):
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, tmdb_id):
        try:
            data = UserMovieManager.toggle_watchlist(request.user.id, tmdb_id)
            
            serializer = UserMovieDataSerializer(data)
            
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ToggleWatchedView(APIView):
   
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, tmdb_id):
        try:
            data = UserMovieManager.toggle_watched(request.user.id, tmdb_id)
            
            serializer = UserMovieDataSerializer(data)
            
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class RateMovieView(APIView):
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, tmdb_id):
        serializer = RatingSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                data = UserMovieManager.rate_movie(
                    request.user.id,
                    tmdb_id,
                    serializer.validated_data['rating']
                )
                
                response_serializer = UserMovieDataSerializer(data)
                
                return Response(response_serializer.data)
                
            except ValueError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
class TopRatedMoviesView(APIView):
    
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get(self, request):
        page = int(request.query_params.get('page', 1))
        response = MovieManager.get_top_rated_movies(page=page)
        movies = response.get('results', [])
        
        for movie in movies:
            user_data = UserMovieManager.get_user_movie_data(request.user.id, movie['tmdb_id'])
            if user_data:
                movie['user_data'] = {
                    'favorite': user_data.get('favorite', False),
                    'watchlist': user_data.get('watchlist', False),
                    'watched': user_data.get('watched', False),
                    'rating': user_data.get('rating')
                }
        
        return Response({
            'results': movies,
            'page': response.get('page', 1),
            'total_pages': response.get('total_pages', 1),
            'total_results': response.get('total_results', 0)
        })


class NowPlayingMoviesView(APIView):
   
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get(self, request):
        page = int(request.query_params.get('page', 1))
        response = MovieManager.get_now_playing_movies(page=page)
        movies = response.get('results', [])
        
        for movie in movies:
            user_data = UserMovieManager.get_user_movie_data(request.user.id, movie['tmdb_id'])
            if user_data:
                movie['user_data'] = {
                    'favorite': user_data.get('favorite', False),
                    'watchlist': user_data.get('watchlist', False),
                    'watched': user_data.get('watched', False),
                    'rating': user_data.get('rating')
                }
        
        return Response({
            'results': movies,
            'page': response.get('page', 1),
            'total_pages': response.get('total_pages', 1),
            'total_results': response.get('total_results', 0)
        })


class UpcomingMoviesView(APIView):
   
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get(self, request):
        page = int(request.query_params.get('page', 1))
        response = MovieManager.get_upcoming_movies(page=page)
        movies = response.get('results', [])
        
        for movie in movies:
            user_data = UserMovieManager.get_user_movie_data(request.user.id, movie['tmdb_id'])
            if user_data:
                movie['user_data'] = {
                    'favorite': user_data.get('favorite', False),
                    'watchlist': user_data.get('watchlist', False),
                    'watched': user_data.get('watched', False),
                    'rating': user_data.get('rating')
                }
        
        return Response({
            'results': movies,
            'page': response.get('page', 1),
            'total_pages': response.get('total_pages', 1),
            'total_results': response.get('total_results', 0)
        })
    
class TopRatedMoviesView(APIView):
   
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        page = int(request.query_params.get('page', 1))
        response = MovieManager.get_top_rated_movies(page=page)
        movies = response.get('results', [])
        
        for movie in movies:
            user_data = UserMovieManager.get_user_movie_data(request.user.id, movie['tmdb_id'])
            if user_data:
                movie['user_data'] = {
                    'favorite': user_data.get('favorite', False),
                    'watchlist': user_data.get('watchlist', False),
                    'watched': user_data.get('watched', False),
                    'rating': user_data.get('rating')
                }
        
        return Response({
            'results': movies,
            'page': response.get('page', 1),
            'total_pages': response.get('total_pages', 1),
            'total_results': response.get('total_results', 0)
        })


class NowPlayingMoviesView(APIView):
   
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        page = int(request.query_params.get('page', 1))
        response = MovieManager.get_now_playing_movies(page=page)
        movies = response.get('results', [])
        
        for movie in movies:
            user_data = UserMovieManager.get_user_movie_data(request.user.id, movie['tmdb_id'])
            if user_data:
                movie['user_data'] = {
                    'favorite': user_data.get('favorite', False),
                    'watchlist': user_data.get('watchlist', False),
                    'watched': user_data.get('watched', False),
                    'rating': user_data.get('rating')
                }
        
        return Response({
            'results': movies,
            'page': response.get('page', 1),
            'total_pages': response.get('total_pages', 1),
            'total_results': response.get('total_results', 0)
        })


class UpcomingMoviesView(APIView):
   
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        page = int(request.query_params.get('page', 1))
        response = MovieManager.get_upcoming_movies(page=page)
        movies = response.get('results', [])
        
        for movie in movies:
            user_data = UserMovieManager.get_user_movie_data(request.user.id, movie['tmdb_id'])
            if user_data:
                movie['user_data'] = {
                    'favorite': user_data.get('favorite', False),
                    'watchlist': user_data.get('watchlist', False),
                    'watched': user_data.get('watched', False),
                    'rating': user_data.get('rating')
                }
        
        return Response({
            'results': movies,
            'page': response.get('page', 1),
            'total_pages': response.get('total_pages', 1),
            'total_results': response.get('total_results', 0)
        })