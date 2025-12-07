import React, { useState, useRef, useEffect } from 'react';
import { 
  Container, Typography, Button, TextField, Grid, Paper, 
  CircularProgress, Snackbar, Alert, Box
} from '@mui/material';
import { CameraAlt, CloudUpload, LocationOn, Description } from '@mui/icons-material';
import './index.css';

const UserAsReporter = () => {
  // State for camera and photo
  const [showCamera, setShowCamera] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoURL, setPhotoURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  
  // Form data
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  
  // Refs for camera elements
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  
  // Set current date and time on component mount
  useEffect(() => {
    const now = new Date();
    setDateTime(now.toISOString().slice(0, 16));
  }, []);
  
  // Function to get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=YOUR_GOOGLE_CLOUD_API_KEY`
            );
            const data = await response.json();
            if (data.results && data.results[0]) {
              setLocation(data.results[0].formatted_address);
            } else {
              setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
            }
          } catch (error) {
            console.error('Error getting location:', error);
            setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error('Error accessing location:', error);
          setIsLoading(false);
          showAlert('Could not access your location. Please enter it manually.', 'warning');
        }
      );
    } else {
      showAlert('Geolocation is not supported by your browser', 'error');
    }
  };

  // Function to start camera
  const startCamera = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      showAlert('Could not access camera. Please check permissions.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  // Function to take photo
  const takePhoto = () => {
    const width = 320;
    const height = 240;

    const video = videoRef.current;
    const photo = photoRef.current;

    if (!video || !photo) return;

    photo.width = width;
    photo.height = height;

    const ctx = photo.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    setHasPhoto(true);
    
    // Get location when photo is taken
    getCurrentLocation();
    
    // Stop camera after taking photo
    stopCamera();
  };

  // Function to upload to Cloudinary
  const uploadToCloudinary = async (base64Image) => {
    try {
      // Remove the data URL prefix
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', `data:image/jpeg;base64,${base64Data}`);
      formData.append('upload_preset', 'YOUR_CLOUDINARY_UPLOAD_PRESET');
      
      // Upload to Cloudinary
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/YOUR_CLOUDINARY_CLOUD_NAME/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const data = await response.json();
      
      if (data.secure_url) {
        console.log('Cloudinary URL:', data.secure_url);
        return data.secure_url;
      } else {
        throw new Error('Failed to get image URL');
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  // Function to submit the report
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasPhoto) {
      showAlert('Please take a photo first', 'warning');
      return;
    }
    
    if (!location) {
      showAlert('Please provide a location', 'warning');
      return;
    }
    
    try {
      setIsLoading(true);
      const base64Image = photoRef.current.toDataURL('image/jpeg');
      const imageUrl = await uploadToCloudinary(base64Image);
      
      // Send data to backend
      const response = await fetch('http://localhost:5000/api/report/unknown-person', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          photoURL: imageUrl,
          location: location,
          dateTime: dateTime,
          description: description
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        resetForm();
        showAlert('Sighting reported successfully!', 'success');
      } else {
        throw new Error(data.message || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      showAlert(error.message || 'Failed to submit report. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reset the form
  const resetForm = () => {
    setHasPhoto(false);
    setPhotoURL('');
    setLocation('');
    setDescription('');
    const now = new Date();
    setDateTime(now.toISOString().slice(0, 16));
  };

  // Function to show alert
  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setOpenAlert(true);
  };

  return (
    <Container maxWidth="md" className="reporter-container">
      <Paper elevation={3} className="reporter-paper">
        <Typography variant="h4" component="h1" gutterBottom className="reporter-title">
          Report Unknown Person Sighting
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box className="camera-section">
                {!hasPhoto ? (
                  <div className="camera-container">
                    {showCamera ? (
                      <>
                        <div className="video-container">
                          <video ref={videoRef} autoPlay playsInline className="camera-video" />
                          <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={takePhoto} 
                            className="capture-button"
                            startIcon={<CameraAlt />}
                            disabled={isLoading}
                          >
                            Take Photo
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={startCamera} 
                        className="start-camera-button"
                        startIcon={<CameraAlt />}
                        disabled={isLoading}
                        fullWidth
                      >
                        Start Camera
                      </Button>
                    )}
                    <canvas ref={photoRef} style={{ display: 'none' }} />
                  </div>
                ) : (
                  <div className="photo-preview">
                    <img src={photoRef.current?.toDataURL()} alt="Captured" className="captured-image" />
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      onClick={() => {
                        setHasPhoto(false);
                        startCamera();
                      }}
                      className="retake-button"
                      disabled={isLoading}
                    >
                      Retake Photo
                    </Button>
                  </div>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box className="location-section">
                <TextField 
                  label="Location" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  fullWidth 
                  required
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: <LocationOn color="action" />,
                    endAdornment: (
                      <Button 
                        onClick={getCurrentLocation} 
                        disabled={isLoading}
                        size="small"
                      >
                        Get Current
                      </Button>
                    )
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField 
                label="Date & Time" 
                type="datetime-local" 
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                InputLabelProps={{ shrink: true }} 
                fullWidth 
                required
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField 
                label="Description / Notes" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth 
                multiline 
                rows={3} 
                disabled={isLoading}
                InputProps={{
                  startAdornment: <Description color="action" />,
                }}
                placeholder="Describe the person and any other relevant details"
              />
            </Grid>
            
            <Grid item xs={12} className="button-container">
              <Button 
                type="button" 
                variant="outlined" 
                color="secondary" 
                onClick={resetForm}
                disabled={isLoading}
                className="form-button"
              >
                Reset
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={!hasPhoto || isLoading}
                className="form-button"
                startIcon={<CloudUpload />}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Submit Report'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <CircularProgress />
        </div>
      )}
      
      {/* Alert snackbar */}
      <Snackbar 
        open={openAlert} 
        autoHideDuration={6000} 
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenAlert(false)} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserAsReporter;