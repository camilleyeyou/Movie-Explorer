import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Avatar, 
  Button, 
  TextField, 
  Divider, 
  Alert, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Tab, 
  Tabs 
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Delete as DeleteIcon,
  Lock as LockIcon,
  Photo as PhotoIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { getToken } from '../utils/auth';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProfilePage = () => {
  const { user, changePassword, deleteAccount, error, setError } = useAuth();
  
  // State
  const [tabValue, setTabValue] = useState(0);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError(null);
    setSuccessMessage(null);
  };
  
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleProfileUpdate = async (formData) => {
    try {
      const data = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'profile_picture' && formData[key] instanceof File) {
          data.append('profile_picture', formData[key]);
        } else if (formData[key] !== undefined && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });
      
      const response = await axios.put('/api/users/profile/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${getToken()}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };
  
  const profileFormik = useFormik({
    initialValues: {
      email: user?.email || '',
      username: user?.username || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      bio: user?.bio || '',
      birth_date: user?.birth_date || ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      username: Yup.string().required('Required').min(3, 'Must be at least 3 characters'),
      first_name: Yup.string(),
      last_name: Yup.string(),
      bio: Yup.string(),
      birth_date: Yup.date().nullable()
    }),
    onSubmit: async (values) => {
      setError(null);
      setSuccessMessage(null);
      
      if (profilePicture) {
        values.profile_picture = profilePicture;
      }
      
      try {
        await handleProfileUpdate(values);
        setSuccessMessage('Profile updated successfully');
        setProfilePicture(null);
      } catch (error) {
        setError(error.response?.data?.detail || 'Failed to update profile');
      }
    }
  });
  
  const passwordFormik = useFormik({
    initialValues: {
      old_password: '',
      new_password: '',
      confirm_password: ''
    },
    validationSchema: Yup.object({
      old_password: Yup.string().required('Required'),
      new_password: Yup.string()
        .required('Required')
        .min(8, 'Must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          'Must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
      confirm_password: Yup.string()
        .required('Required')
        .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
    }),
    onSubmit: async (values) => {
      setError(null);
      setSuccessMessage(null);
      
      const success = await changePassword(
        values.old_password,
        values.new_password,
        values.confirm_password
      );
      
      if (success) {
        setSuccessMessage('Password changed successfully');
        passwordFormik.resetForm();
      }
    }
  });
  
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  const handleDeleteAccount = async () => {
    await deleteAccount();
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>
      </Box>
      
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
          >
            <Tab label="Profile Information" />
            <Tab label="Change Password" />
            <Tab label="Account Settings" />
          </Tabs>
        </Box>
        
        {/* Profile Information Tab */}
        <TabPanel value={tabValue} index={0}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          )}
          
          <form onSubmit={profileFormik.handleSubmit}>
            <Grid container spacing={3}>
              {/* Profile Picture */}
              <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  src={profilePicturePreview || user?.profile_picture}
                  sx={{ width: 150, height: 150, mb: 2 }}
                />
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoIcon />}
                >
                  Change Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                  />
                </Button>
              </Grid>
              
              {/* Profile Fields */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email"
                      value={profileFormik.values.email}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      error={profileFormik.touched.email && Boolean(profileFormik.errors.email)}
                      helperText={profileFormik.touched.email && profileFormik.errors.email}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="username"
                      name="username"
                      label="Username"
                      value={profileFormik.values.username}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      error={profileFormik.touched.username && Boolean(profileFormik.errors.username)}
                      helperText={profileFormik.touched.username && profileFormik.errors.username}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="first_name"
                      name="first_name"
                      label="First Name"
                      value={profileFormik.values.first_name}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      error={profileFormik.touched.first_name && Boolean(profileFormik.errors.first_name)}
                      helperText={profileFormik.touched.first_name && profileFormik.errors.first_name}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="last_name"
                      name="last_name"
                      label="Last Name"
                      value={profileFormik.values.last_name}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      error={profileFormik.touched.last_name && Boolean(profileFormik.errors.last_name)}
                      helperText={profileFormik.touched.last_name && profileFormik.errors.last_name}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="bio"
                      name="bio"
                      label="Bio"
                      multiline
                      rows={4}
                      value={profileFormik.values.bio}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      error={profileFormik.touched.bio && Boolean(profileFormik.errors.bio)}
                      helperText={profileFormik.touched.bio && profileFormik.errors.bio}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="birth_date"
                      name="birth_date"
                      label="Birth Date"
                      type="date"
                      value={profileFormik.values.birth_date || ''}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      error={profileFormik.touched.birth_date && Boolean(profileFormik.errors.birth_date)}
                      helperText={profileFormik.touched.birth_date && profileFormik.errors.birth_date}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={profileFormik.isSubmitting}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </TabPanel>
        
        {/* Change Password Tab */}
        <TabPanel value={tabValue} index={1}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          )}
          
          <form onSubmit={passwordFormik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="old_password"
                  name="old_password"
                  label="Current Password"
                  type="password"
                  value={passwordFormik.values.old_password}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  error={passwordFormik.touched.old_password && Boolean(passwordFormik.errors.old_password)}
                  helperText={passwordFormik.touched.old_password && passwordFormik.errors.old_password}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="new_password"
                  name="new_password"
                  label="New Password"
                  type="password"
                  value={passwordFormik.values.new_password}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  error={passwordFormik.touched.new_password && Boolean(passwordFormik.errors.new_password)}
                  helperText={passwordFormik.touched.new_password && passwordFormik.errors.new_password}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="confirm_password"
                  name="confirm_password"
                  label="Confirm New Password"
                  type="password"
                  value={passwordFormik.values.confirm_password}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  error={passwordFormik.touched.confirm_password && Boolean(passwordFormik.errors.confirm_password)}
                  helperText={passwordFormik.touched.confirm_password && passwordFormik.errors.confirm_password}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<LockIcon />}
                    disabled={passwordFormik.isSubmitting}
                  >
                    Change Password
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </TabPanel>
        
        {/* Account Settings Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Danger Zone
          </Typography>
          
          <Alert severity="warning" sx={{ mb: 3 }}>
            Deleting your account is permanent. All your data will be permanently removed and cannot be recovered.
          </Alert>
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleOpenDeleteDialog}
            >
              Delete Account
            </Button>
          </Box>
          
          {/* Delete Account Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete your account?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                This action cannot be undone. All your data, including your profile, favorites, watchlist, and ratings will be permanently deleted.
                Are you sure you want to delete your account?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
              <Button onClick={handleDeleteAccount} color="error" autoFocus>
                Delete Account
              </Button>
            </DialogActions>
          </Dialog>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ProfilePage;