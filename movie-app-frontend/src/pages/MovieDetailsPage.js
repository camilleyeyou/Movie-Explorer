import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Rating,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  ListItemIcon,
  CardActionArea
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  Visibility,
  VisibilityOff,
  ArrowBack,
  Star,
  AttachMoney,
  Language,
  AccessTime,
  CalendarToday,
  YouTube
} from '@mui/icons-material';
import useMovies from '../hooks/useMovies';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [actionError, setActionError] = useState(null);
  
  const {
    loading,
    error,
    getMovieDetails,
    toggleFavorite,
    toggleWatchlist,
    toggleWatched,
    rateMovie
  } = useMovies();
  
  useEffect(() => {
    const fetchMovieDetails = async () => {
      const response = await getMovieDetails(id);
      if (response) {
        setMovie(response);
      }
    };
    
    fetchMovieDetails();
  }, [getMovieDetails, id]);
  
  const userData = movie?.user_data || {
    favorite: false,
    watchlist: false,
    watched: false,
    rating: null
  };
  
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleToggleFavorite = async () => {
    setActionError(null);
    const result = await toggleFavorite(movie.tmdb_id);
    if (!result) {
      setActionError('Failed to update favorite status. Please try again.');
    } else {
      setMovie({
        ...movie,
        user_data: {
          ...movie.user_data,
          favorite: !movie.user_data.favorite
        }
      });
    }
  };
  
  const handleToggleWatchlist = async () => {
    setActionError(null);
    const result = await toggleWatchlist(movie.tmdb_id);
    if (!result) {
      setActionError('Failed to update watchlist status. Please try again.');
    } else {
      setMovie({
        ...movie,
        user_data: {
          ...movie.user_data,
          watchlist: !movie.user_data.watchlist
        }
      });
    }
  };
  
  const handleToggleWatched = async () => {
    setActionError(null);
    const result = await toggleWatched(movie.tmdb_id);
    if (!result) {
      setActionError('Failed to update watched status. Please try again.');
    } else {
      setMovie({
        ...movie,
        user_data: {
          ...movie.user_data,
          watched: !movie.user_data.watched
        }
      });
    }
  };
  
  const handleRateMovie = async (event, newValue) => {
    setActionError(null);
    const result = await rateMovie(movie.tmdb_id, newValue);
    if (!result) {
      setActionError('Failed to rate movie. Please try again.');
    } else {
      setMovie({
        ...movie,
        user_data: {
          ...movie.user_data,
          rating: newValue,
          watched: true 
        }
      });
    }
  };
  
  const goBack = () => {
    navigate(-1);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={goBack}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (!movie) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="info">Loading movie details...</Alert>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      {/* Back button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={goBack}
        >
          Back
        </Button>
      </Box>
      
      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}
      
      {/* Movie backdrop */}
      {movie.backdrop_path && (
        <Paper
          sx={{
            position: 'relative',
            height: '300px',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${movie.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            borderRadius: 2
          }}
        >
          <Typography variant="h3" component="h1" align="center">
            {movie.title}
          </Typography>
        </Paper>
      )}
      
      <Grid container spacing={4}>
        {/* Left column - Poster and actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              image={movie.poster_path || 'https://via.placeholder.com/300x450?text=No+Poster'}
              alt={movie.title}
              sx={{ height: 'auto' }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Tooltip title={userData.favorite ? "Remove from favorites" : "Add to favorites"}>
                    <IconButton
                      color={userData.favorite ? "error" : "default"}
                      onClick={handleToggleFavorite}
                    >
                      {userData.favorite ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title={userData.watchlist ? "Remove from watchlist" : "Add to watchlist"}>
                    <IconButton
                      color={userData.watchlist ? "primary" : "default"}
                      onClick={handleToggleWatchlist}
                    >
                      {userData.watchlist ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title={userData.watched ? "Mark as unwatched" : "Mark as watched"}>
                    <IconButton
                      color={userData.watched ? "success" : "default"}
                      onClick={handleToggleWatched}
                    >
                      {userData.watched ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Your Rating:
                  </Typography>
                  <Rating
                    name={`rating-${movie.tmdb_id}`}
                    value={userData.rating || 0}
                    precision={0.5}
                    onChange={handleRateMovie}
                  />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
                <Typography variant="body1" color="text.secondary" mr={1}>
                  TMDB Rating:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating
                    name="read-only"
                    value={movie.vote_average / 2}
                    precision={0.1}
                    readOnly
                  />
                  <Typography variant="body1" color="text.secondary" ml={1}>
                    ({movie.vote_average}/10)
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                {movie.vote_count} votes
              </Typography>
            </CardContent>
          </Card>
          
          {/* Movie Info */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Movie Info
              </Typography>
              
              <List disablePadding>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <CalendarToday fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Release Date"
                    secondary={formatDate(movie.release_date)}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <AccessTime fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Runtime"
                    secondary={formatRuntime(movie.runtime)}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <AttachMoney fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Budget"
                    secondary={formatCurrency(movie.budget)}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <AttachMoney fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Revenue"
                    secondary={formatCurrency(movie.revenue)}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <Language fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Original Language"
                    secondary={movie.original_language?.toUpperCase() || 'N/A'}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                
                {movie.homepage && (
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: '40px' }}>
                      <Language fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Website"
                      secondary={
                        <a href={movie.homepage} target="_blank" rel="noopener noreferrer">
                          Visit website
                        </a>
                      }
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Right column - Details */}
        <Grid item xs={12} md={8}>
          {!movie.backdrop_path && (
            <Typography variant="h3" component="h1" gutterBottom>
              {movie.title}
            </Typography>
          )}
          
          {/* Tagline */}
          {movie.tagline && (
            <Typography
              variant="h6"
              component="h2"
              color="text.secondary"
              gutterBottom
              fontStyle="italic"
            >
              {movie.tagline}
            </Typography>
          )}
          
          {/* Genres */}
          <Box sx={{ mb: 3 }}>
            {movie.genres?.map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
          
          {/* Overview */}
          <Typography variant="h6" gutterBottom>
            Overview
          </Typography>
          <Typography variant="body1" paragraph>
            {movie.overview || 'No overview available.'}
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Cast */}
          {movie.cast && movie.cast.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Cast
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {movie.cast.slice(0, 8).map((person) => (
                  <Grid item xs={6} sm={3} key={person.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardMedia
                        component="img"
                        image={person.profile_path || 'https://via.placeholder.com/150x225?text=No+Image'}
                        alt={person.name}
                        sx={{ height: 150, objectFit: 'cover' }}
                      />
                      <CardContent sx={{ py: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {person.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {person.character}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
          
          {/* Videos */}
          {movie.videos && movie.videos.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Videos
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {movie.videos.slice(0, 3).map((video) => (
                  <Grid item xs={12} sm={4} key={video.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardMedia
                        component="img"
                        image={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                        alt={video.name}
                        sx={{ height: 150, objectFit: 'cover' }}
                      />
                      <CardContent sx={{ py: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {video.name}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<YouTube />}
                          href={`https://www.youtube.com/watch?v=${video.key}`}
                          target="_blank"
                          sx={{ mt: 1 }}
                        >
                          Watch
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
          
          {/* Recommendations */}
          {movie.recommendations && movie.recommendations.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Recommendations
              </Typography>
              <Grid container spacing={2}>
                {movie.recommendations.slice(0, 4).map((rec) => (
                  <Grid item xs={6} sm={3} key={rec.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardActionArea component={Link} to={`/movies/${rec.id}`}>
                        <CardMedia
                          component="img"
                          image={rec.poster_path || 'https://via.placeholder.com/150x225?text=No+Image'}
                          alt={rec.title}
                          sx={{ height: 200, objectFit: 'cover' }}
                        />
                        <CardContent sx={{ py: 1 }}>
                          <Typography variant="subtitle2" noWrap>
                            {rec.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Star fontSize="small" color="warning" />
                            <Typography variant="body2" color="text.secondary" ml={0.5}>
                              {rec.vote_average.toFixed(1)}
                            </Typography>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MovieDetailsPage;