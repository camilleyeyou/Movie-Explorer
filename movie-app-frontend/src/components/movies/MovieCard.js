import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Rating,
  Tooltip
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

const MovieCard = ({
  movie,
  onToggleFavorite,
  onToggleWatchlist,
  onToggleWatched,
  onRateMovie
}) => {
  const posterUrl = movie.poster_path || 'https://via.placeholder.com/300x450?text=No+Poster';
  
  const userData = movie.user_data || {
    favorite: false,
    watchlist: false,
    watched: false,
    rating: null
  };
  
  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    return date.getFullYear() || 'Unknown';
  };
  
  const handleRateMovie = (event, newValue) => {
    if (onRateMovie) {
      onRateMovie(movie.tmdb_id, newValue);
    }
  };
  
  return (
    <Card sx={{ maxWidth: 300, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={Link} to={`/movies/${movie.tmdb_id}`}>
        <CardMedia
          component="img"
          height="450"
          image={posterUrl}
          alt={movie.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatReleaseDate(movie.release_date)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" color="text.secondary" mr={1}>
              {movie.vote_average.toFixed(1)}
            </Typography>
            <Rating
              name="read-only"
              value={movie.vote_average / 2}
              precision={0.5}
              size="small"
              readOnly
            />
            <Typography variant="body2" color="text.secondary" ml={1}>
              ({movie.vote_count})
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      
      <CardActions sx={{ justifyContent: 'space-between', padding: 1 }}>
        <Box>
          <Tooltip title={userData.favorite ? "Remove from favorites" : "Add to favorites"}>
            <IconButton 
              size="small" 
              color={userData.favorite ? "error" : "default"}
              onClick={() => onToggleFavorite(movie.tmdb_id)}
            >
              {userData.favorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title={userData.watchlist ? "Remove from watchlist" : "Add to watchlist"}>
            <IconButton 
              size="small" 
              color={userData.watchlist ? "primary" : "default"}
              onClick={() => onToggleWatchlist(movie.tmdb_id)}
            >
              {userData.watchlist ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title={userData.watched ? "Mark as unwatched" : "Mark as watched"}>
            <IconButton 
              size="small" 
              color={userData.watched ? "success" : "default"}
              onClick={() => onToggleWatched(movie.tmdb_id)}
            >
              {userData.watched ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box>
          <Rating
            name={`rating-${movie.tmdb_id}`}
            value={userData.rating || 0}
            precision={0.5}
            size="small"
            onChange={handleRateMovie}
          />
        </Box>
      </CardActions>
    </Card>
  );
};

export default MovieCard;