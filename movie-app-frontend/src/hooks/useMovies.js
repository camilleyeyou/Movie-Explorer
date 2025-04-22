import { useState, useCallback } from 'react';
import { moviesAPI } from '../services/api';

const useMovies = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPopularMovies = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await moviesAPI.getPopular(page);
      return response.data;
    } catch (err) {
      console.error('Error fetching popular movies:', err);
      setError('Failed to fetch popular movies. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTopRatedMovies = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await moviesAPI.getTopRated(page);
      return response.data;
    } catch (err) {
      console.error('Error fetching top rated movies:', err);
      setError('Failed to fetch top rated movies. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getNowPlayingMovies = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await moviesAPI.getNowPlaying(page);
      return response.data;
    } catch (err) {
      console.error('Error fetching now playing movies:', err);
      setError('Failed to fetch now playing movies. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUpcomingMovies = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await moviesAPI.getUpcoming(page);
      return response.data;
    } catch (err) {
      console.error('Error fetching upcoming movies:', err);
      setError('Failed to fetch upcoming movies. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback(async (movieId) => {
    try {
      await moviesAPI.toggleFavorite(movieId);
      return true;
    } catch (err) {
      console.error('Error toggling favorite status:', err);
      return false;
    }
  }, []);

  const toggleWatchlist = useCallback(async (movieId) => {
    try {
      await moviesAPI.toggleWatchlist(movieId);
      return true;
    } catch (err) {
      console.error('Error toggling watchlist status:', err);
      return false;
    }
  }, []);

  const toggleWatched = useCallback(async (movieId) => {
    try {
      await moviesAPI.toggleWatched(movieId);
      return true;
    } catch (err) {
      console.error('Error toggling watched status:', err);
      return false;
    }
  }, []);

  const rateMovie = useCallback(async (movieId, rating) => {
    try {
      await moviesAPI.rateMovie(movieId, rating);
      return true;
    } catch (err) {
      console.error('Error rating movie:', err);
      return false;
    }
  }, []);

  const searchMovies = useCallback(async (query, page = 1) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await moviesAPI.searchMovies(query, page);
      return response.data;
    } catch (err) {
      console.error('Error searching movies:', err);
      setError('Failed to search movies. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMovieDetails = useCallback(async (movieId) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await moviesAPI.getMovieDetails(movieId);
      return response.data;
    } catch (err) {
      console.error('Error fetching movie details:', err);
      setError('Failed to fetch movie details. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFavorites = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await moviesAPI.getFavorites(page);
      return response.data;
    } catch (err) {
      console.error('Error fetching favorite movies:', err);
      setError('Failed to fetch favorite movies. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const getWatchlist = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await moviesAPI.getWatchlist(page);
      return response.data;
    } catch (err) {
      console.error('Error fetching watchlist movies:', err);
      setError('Failed to fetch watchlist movies. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const getWatched = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await moviesAPI.getWatched(page);
      return response.data;
    } catch (err) {
      console.error('Error fetching watched movies:', err);
      setError('Failed to fetch watched movies. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const getRated = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await moviesAPI.getRated(page);
      return response.data;
    } catch (err) {
      console.error('Error fetching rated movies:', err);
      setError('Failed to fetch rated movies. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getPopularMovies,
    getTopRatedMovies,
    getNowPlayingMovies,
    getUpcomingMovies,
    getMovieDetails,
    searchMovies,
    getFavorites,
    getWatchlist,
    getWatched,
    getRated,
    toggleFavorite,
    toggleWatchlist,
    toggleWatched,
    rateMovie
  };
};

export default useMovies;