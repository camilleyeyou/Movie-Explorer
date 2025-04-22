import React from 'react';
import { Grid, Box, Typography, Pagination, CircularProgress } from '@mui/material';
import MovieCard from './MovieCard';

const MovieGrid = ({
  movies = [],
  loading = false,
  error = null,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  onToggleFavorite,
  onToggleWatchlist,
  onToggleWatched,
  onRateMovie,
  emptyMessage = "No movies found"
}) => {
  const handlePageChange = (event, value) => {
    if (onPageChange) {
      onPageChange(value);
    }
  };

  const hasMovies = movies && movies.length > 0;
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }
  
  if (!hasMovies) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h6" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.tmdb_id}>
            <MovieCard
              movie={movie}
              onToggleFavorite={onToggleFavorite}
              onToggleWatchlist={onToggleWatchlist}
              onToggleWatched={onToggleWatched}
              onRateMovie={onRateMovie}
            />
          </Grid>
        ))}
      </Grid>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            color="primary"
            onChange={handlePageChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default MovieGrid;