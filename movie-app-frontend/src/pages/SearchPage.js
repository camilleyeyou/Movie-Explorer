import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Typography, 
  Container, 
  Box, 
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Alert
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import MovieGrid from '../components/movies/MovieGrid';
import useMovies from '../hooks/useMovies';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('query') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionError, setActionError] = useState(null);
  
  const { 
    loading, 
    error, 
    searchMovies,
    toggleFavorite,
    toggleWatchlist,
    toggleWatched,
    rateMovie
  } = useMovies();
  
  useEffect(() => {
    const performSearch = async () => {
      if (queryFromUrl.trim() && searchMovies) {  
        try {
          const response = await searchMovies(queryFromUrl, currentPage);
          if (response) {
            setSearchResults(response.results);
            setTotalPages(response.total_pages > 100 ? 100 : response.total_pages);
          }
        } catch (error) {
          console.error("Error performing search:", error);
        }
      }
    };
    
    performSearch();
  }, [searchMovies, queryFromUrl, currentPage]);
  useEffect(() => {
    setSearchQuery(queryFromUrl);
  }, [queryFromUrl]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ query: searchQuery.trim() });
      setCurrentPage(1); 
    }
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
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
      setSearchResults(prev => 
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
      setSearchResults(prev => 
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
      setSearchResults(prev => 
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
      setSearchResults(prev => 
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
          Search Movies
        </Typography>
      </Box>
      
      {/* Search form */}
      <Paper component="form" onSubmit={handleSearch} sx={{ p: 2, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={handleClearSearch}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>
      
      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}
      
      {/* Search results */}
      {queryFromUrl ? (
        <>
          <Typography variant="h6" gutterBottom>
            Search results for: "{queryFromUrl}"
          </Typography>
          
          <MovieGrid
            movies={searchResults}
            loading={loading}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onToggleFavorite={handleToggleFavorite}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleWatched={handleToggleWatched}
            onRateMovie={handleRateMovie}
            emptyMessage="No movies found for your search. Try a different query."
          />
        </>
      ) : (
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Enter a search term to find movies
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default SearchPage;