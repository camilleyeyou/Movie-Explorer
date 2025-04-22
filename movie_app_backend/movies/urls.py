from django.urls import path
from .views import (
    PopularMoviesView,
    TopRatedMoviesView,
    NowPlayingMoviesView,
    UpcomingMoviesView,
    MovieSearchView,
    MovieDetailView,
    FavoriteMoviesView,
    WatchlistMoviesView,
    WatchedMoviesView,
    RatedMoviesView,
    ToggleFavoriteView,
    ToggleWatchlistView,
    ToggleWatchedView,
    RateMovieView
)

urlpatterns = [
    path('popular/', PopularMoviesView.as_view(), name='popular-movies'),
    path('top_rated/', TopRatedMoviesView.as_view(), name='top-rated-movies'),
    path('now_playing/', NowPlayingMoviesView.as_view(), name='now-playing-movies'),
    path('upcoming/', UpcomingMoviesView.as_view(), name='upcoming-movies'),
    path('search/', MovieSearchView.as_view(), name='search-movies'),
    path('details/<int:tmdb_id>/', MovieDetailView.as_view(), name='movie-details'),
    path('favorites/', FavoriteMoviesView.as_view(), name='favorite-movies'),
    path('watchlist/', WatchlistMoviesView.as_view(), name='watchlist-movies'),
    path('watched/', WatchedMoviesView.as_view(), name='watched-movies'),
    path('rated/', RatedMoviesView.as_view(), name='rated-movies'),
    path('favorite/<int:tmdb_id>/', ToggleFavoriteView.as_view(), name='toggle-favorite'),
    path('watchlist/<int:tmdb_id>/', ToggleWatchlistView.as_view(), name='toggle-watchlist'),
    path('watched/<int:tmdb_id>/', ToggleWatchedView.as_view(), name='toggle-watched'),
    path('rate/<int:tmdb_id>/', RateMovieView.as_view(), name='rate-movie'),
]