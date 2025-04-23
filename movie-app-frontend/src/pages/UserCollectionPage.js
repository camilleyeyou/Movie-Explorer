import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Typography, 
  Container, 
  Box, 
  Alert,
  Divider
} from '@mui/material';
import MovieGrid from '../components/movies/MovieGrid';
import useMovies from '../hooks/useMovies';

const UserCollectionPage = () => {
  const location = useLocation();
  
  const getCollectionType = () => {
    const path = location.pathname;
    if (path.includes('favorites')) return 'favorites';
    if (path.includes('watchlist')) return 'watchlist';
    if (path.includes('watched')) return 'watched';
    if (path.includes('rated')) return 'rated';
    return '';
  };
  
  const collectionType = getCollectionType();
  
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionError, setActionError] = useState(null);
  
  const { 
    loading, 
    error, 
    getFavorites,
    getWatchlist,
    getWatched,
    getRated,
    toggleFavorite,
    toggleWatchlist,
    toggleWatched,
    rateMovie
  } = useMovies();
  
  const getCollectionInfo = () => {
    switch (collectionType) {
      case 'favorites':
        return {
          title: 'Favorite Movies',
          fetchFunc: getFavorites,
          emptyMessage: 'You have not added any movies to your favorites yet.'
        };
      case 'watchlist':
        return {
          title: 'Watchlist',
          fetchFunc: getWatchlist,
          emptyMessage: 'You have not added any movies to your watchlist yet.'
        };
      case 'watched':
        return {
          title: 'Watched Movies',
          fetchFunc: getWatched,
          emptyMessage: 'You have not marked any movies as watched yet.'
        };
      case 'rated':
        return {
          title: 'Rated Movies',
          fetchFunc: getRated,
          emptyMessage: 'You have not rated any movies yet.'
        };
      default:
        return {
          title: 'Movies',
          fetchFunc: () => null,
          emptyMessage: 'No movies found.'
        };
    }
  };
  
  const { title, fetchFunc, emptyMessage } = getCollectionInfo();
  
  useEffect(() => {
    const fetchMovies = async () => {
      const response = await fetchFunc(currentPage);
      if (response) {
        setMovies(response.results);
        setTotalPages(response.total_pages);
      }
    };
    
    fetchMovies();
  }, [fetchFunc, currentPage, collectionType]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); 
  };
  
  const handleToggleFavorite = async (movieId) => {
    setActionError(null);
    const result = await toggleFavorite(movieId);
    if (!result) {
      setActionError('Failed to update favorite status. Please try again.');
    } else {
      if (collectionType === 'favorites') {
        const response = await fetchFunc(currentPage);
        if (response) {
          setMovies(response.results);
          setTotalPages(response.total_pages);
        }
      } else {
        setMovies(prev => 
          prev.map(movie => 
            movie.tmdb_id === movieId 
              ? { 
                  ...movie, 
                  user_data: { 
                    ...movie.user_data, 
                    favorite: !movie.user_data?.favorite 
                  } 
                } 
              : movie
          )
        );
      }
    }
  };
  
  const handleToggleWatchlist = async (movieId) => {
    setActionError(null);
    const result = await toggleWatchlist(movieId);
    if (!result) {
      setActionError('Failed to update watchlist status. Please try again.');
    } else {
      if (collectionType === 'watchlist') {
        const response = await fetchFunc(currentPage);
        if (response) {
          setMovies(response.results);
          setTotalPages(response.total_pages);
        }
      } else {
        setMovies(prev => 
          prev.map(movie => 
            movie.tmdb_id === movieId 
              ? { 
                  ...movie, 
                  user_data: { 
                    ...movie.user_data, 
                    watchlist: !movie.user_data?.watchlist 
                  } 
                } 
              : movie
          )
        );
      }
    }
  };
  
  const handleToggleWatched = async (movieId) => {
    setActionError(null);
    const result = await toggleWatched(movieId);
    if (!result) {
      setActionError('Failed to update watched status. Please try again.');
    } else {
      if (collectionType === 'watched') {
        const response = await fetchFunc(currentPage);
        if (response) {
          setMovies(response.results);
          setTotalPages(response.total_pages);
        }
      } else {
        setMovies(prev => 
          prev.map(movie => 
            movie.tmdb_id === movieId 
              ? { 
                  ...movie, 
                  user_data: { 
                    ...movie.user_data, 
                    watched: !movie.user_data?.watched 
                  } 
                } 
              : movie
          )
        );
      }
    }
  };
  
  const handleRateMovie = async (movieId, rating) => {
    setActionError(null);
    const result = await rateMovie(movieId, rating);
    if (!result) {
      setActionError('Failed to rate movie. Please try again.');
    } else {
      if (collectionType === 'rated' && rating === 0) {
        const response = await fetchFunc(currentPage);
        if (response) {
          setMovies(response.results);
          setTotalPages(response.total_pages);
        }
      } else {
        setMovies(prev => 
          prev.map(movie => 
            movie.tmdb_id === movieId 
              ? { 
                  ...movie, 
                  user_data: { 
                    ...movie.user_data, 
                    rating: rating,
                    watched: true
                  } 
                } 
              : movie
          )
        );
      }
    }
  };
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
      </Box>
      
      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}
      
      <Divider sx={{ mb: 3 }} />
      
      <MovieGrid
        movies={movies}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onToggleFavorite={handleToggleFavorite}
        onToggleWatchlist={handleToggleWatchlist}
        onToggleWatched={handleToggleWatched}
        onRateMovie={handleRateMovie}
        emptyMessage={emptyMessage}
      />
    </Container>
  );
};

export default UserCollectionPage;