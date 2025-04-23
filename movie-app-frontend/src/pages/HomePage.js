import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Container, 
  Box, 
  Tabs, 
  Tab, 
  Divider,
  Alert
} from '@mui/material';
import MovieGrid from '../components/movies/MovieGrid';
import useMovies from '../hooks/useMovies';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [actionError, setActionError] = useState(null);
  
  const { 
    loading, 
    error, 
    getPopularMovies,
    getTopRatedMovies,
    getNowPlayingMovies,
    getUpcomingMovies,
    toggleFavorite,
    toggleWatchlist,
    toggleWatched,
    rateMovie
  } = useMovies();
  
  const getCategoryTitle = () => {
    switch (tabValue) {
      case 0:
        return "Popular";
      case 1:
        return "Top Rated";
      case 2:
        return "Now Playing";
      case 3:
        return "Upcoming";
      default:
        return "Popular";
    }
  };
  
  useEffect(() => {
    const getFetchFunction = () => {
      switch (tabValue) {
        case 0:
          return getPopularMovies;
        case 1:
          return getTopRatedMovies;
        case 2:
          return getNowPlayingMovies;
        case 3:
          return getUpcomingMovies;
        default:
          return getPopularMovies;
      }
    };

    const fetchMovies = async () => {
      const fetchFunction = getFetchFunction();
      const response = await fetchFunction(currentPage);
      
      if (response) {
        setMovies(response.results);
        setTotalPages(response.total_pages > 100 ? 100 : response.total_pages); 
      }
    };
    
    fetchMovies();
  }, [getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies, currentPage, tabValue]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); 
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrentPage(1); 
    setMovies([]); 
  };
  
  const handleToggleFavorite = async (movieId) => {
    setActionError(null);
    const result = await toggleFavorite(movieId);
    if (!result) {
      setActionError('Failed to update favorite status. Please try again.');
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
  };
  
  const handleToggleWatchlist = async (movieId) => {
    setActionError(null);
    const result = await toggleWatchlist(movieId);
    if (!result) {
      setActionError('Failed to update watchlist status. Please try again.');
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
  };
  
  const handleToggleWatched = async (movieId) => {
    setActionError(null);
    const result = await toggleWatched(movieId);
    if (!result) {
      setActionError('Failed to update watched status. Please try again.');
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
  };
  
  const handleRateMovie = async (movieId, rating) => {
    setActionError(null);
    const result = await rateMovie(movieId, rating);
    if (!result) {
      setActionError('Failed to rate movie. Please try again.');
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
  };
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Discover Movies
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom>
          {getCategoryTitle()}
        </Typography>
      </Box>
      
      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          aria-label="movie categories"
        >
          <Tab label="Popular" />
          <Tab label="Top Rated" />
          <Tab label="Now Playing" />
          <Tab label="Upcoming" />
        </Tabs>
      </Box>
      
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
        emptyMessage={`No ${getCategoryTitle().toLowerCase()} movies found. Try refreshing the page.`}
      />
    </Container>
  );
};

export default HomePage;