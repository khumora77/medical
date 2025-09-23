import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Chip,
  Avatar,
  Snackbar,
} from "@mui/material";
import {
  Edit as EditIcon,
  CameraAlt as CameraIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useAdminStore } from "../../store/adminStore";

const AdminProfile: React.FC = () => {
  const { 
    profile, 
    stats, 
    isLoading, 
    error, 
    fetchProfile, 
    updateProfile, 
    updateAvatar,
    fetchStats,
    clearError 
  } = useAdminStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarEditing, setIsAvatarEditing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Component mount bo'lganda ma'lumotlarni yuklash
  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, [fetchProfile, fetchStats]);

  // Profile ma'lumotlarini editData ga set qilish
  useEffect(() => {
    if (profile) {
      setEditData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(editData);
      setIsEditing(false);
      showSnackbar("Profil muvaffaqiyatli yangilandi!");
    } catch (error) {
      console.error('Profilni yangilashda xatolik:', error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
    setIsEditing(false);
    clearError();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showSnackbar("Fayl hajmi 5MB dan oshmasligi kerak!");
      return;
    }

    try {
      await updateAvatar(file);
      setIsAvatarEditing(false);
      showSnackbar("Profil rasmi muvaffaqiyatli yangilandi!");
    } catch (error) {
      console.error('Avatar yangilashda xatolik:', error);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        streamRef.current = mediaStream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Kamerani ochishda xatolik:", error);
      showSnackbar("Kameraga kirish imkoni yo'q. Iltimos, ruxsatnomalarni tekshiring.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
  };

  const captureFromCamera = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.png", { type: "image/png" });
          try {
            await updateAvatar(file);
            stopCamera();
            setIsAvatarEditing(false);
            showSnackbar("Profil rasmi kameradan muvaffaqiyatli olingan!");
          } catch (error) {
            console.error('Avatar yangilashda xatolik:', error);
          }
        }
      }, "image/png");
    }
  };

  // Avatar Edit Modal komponenti
  const AvatarEditModal = () => (
    <Dialog 
      open={isAvatarEditing} 
      onClose={() => {
        setIsAvatarEditing(false);
        stopCamera();
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Profil rasmini yangilash</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} py={2}>
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            startIcon={<PersonIcon />}
            disabled={isLoading}
          >
            Kompyuterdan rasm tanlash
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {!isCameraActive ? (
            <Button
              variant="outlined"
              onClick={startCamera}
              startIcon={<CameraIcon />}
              disabled={isLoading}
            >
              Kameradan rasm olish
            </Button>
          ) : (
            <Box>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '240px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  objectFit: 'cover'
                }}
              />
              <Box display="flex" gap={1} mt={1}>
                <Button
                  variant="contained"
                  onClick={captureFromCamera}
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={20} /> : 'Rasmni olish'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={stopCamera}
                  fullWidth
                >
                  Bekor qilish
                </Button>
              </Box>
            </Box>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => {
            setIsAvatarEditing(false);
            stopCamera();
          }}
          disabled={isLoading}
        >
          Yopish
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (isLoading && !profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Profil ma'lumotlari topilmadi. Iltimos, qaytadan urinib ko'ring.
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchProfile}
          sx={{ mt: 2 }}
        >
          Qayta Yuklash
        </Button>
      </Box>
    );
  }

  const displayName = profile.firstName && profile.lastName 
    ? `${profile.firstName} ${profile.lastName}`
    : profile.email;

  return (
    <Box p={3}>
      {/* Xatolik ko'rsatish */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom fontWeight="bold">
        Profil Boshqaruvi
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Shaxsiy ma'lumotlaringizni boshqaring va yangilang
      </Typography>

      <Grid container spacing={3}>
        {/* Chap ustun - Profil kartasi */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box position="relative" display="inline-block">
              <Avatar
                src={profile.avatar || undefined}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto',
                  fontSize: '3rem',
                  bgcolor: 'primary.main'
                }}
              >
                {profile.firstName?.[0]}{profile.lastName?.[0] || profile.email?.[0]}
              </Avatar>
              <IconButton
                onClick={() => setIsAvatarEditing(true)}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
                size="small"
                disabled={isLoading}
              >
                <EditIcon />
              </IconButton>
            </Box>

            <Typography variant="h6" sx={{ mt: 2 }} noWrap>
              {displayName}
            </Typography>
            <Chip 
              label={profile.role} 
              color="primary" 
              size="small" 
              sx={{ mt: 1 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {profile.email}
            </Typography>

            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant={isEditing ? "outlined" : "contained"}
                onClick={() => setIsEditing(!isEditing)}
                startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                fullWidth
                disabled={isLoading}
              >
                {isEditing ? 'Bekor qilish' : 'Profilni tahrirlash'}
              </Button>
            </Box>
          </Paper>

          {/* Statistika kartalari */}
          {stats && (
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Statistika
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" color="primary" textAlign="center">
                    {stats.totalUsers}
                  </Typography>
                  <Typography variant="body2" textAlign="center">
                    Foydalanuvchilar
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" color="secondary" textAlign="center">
                    {stats.activeSessions}
                  </Typography>
                  <Typography variant="body2" textAlign="center">
                    Faol Sessiyalar
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>

        {/* O'ng ustun - Profil ma'lumotlari */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">
                Shaxsiy Ma'lumotlar
              </Typography>
              {isEditing && (
                <Chip 
                  label="Tahrirlanmoqda" 
                  color="primary" 
                  size="small" 
                  icon={isLoading ? <CircularProgress size={16} /> : undefined}
                />
              )}
            </Box>

            {isEditing ? (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Ism"
                    name="firstName"
                    value={editData.firstName}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Familiya"
                    name="lastName"
                    value={editData.lastName}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Telefon"
                    name="phone"
                    value={editData.phone}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" gap={2} mt={2}>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                      disabled={isLoading}
                    >
                      Saqlash
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Bekor qilish
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Ism
                  </Typography>
                  <Typography variant="body1">
                    {profile.firstName || 'Ko\'rsatilmagan'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Familiya
                  </Typography>
                  <Typography variant="body1">
                    {profile.lastName || 'Ko\'rsatilmagan'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {profile.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Telefon
                  </Typography>
                  <Typography variant="body1">
                    {profile.phone || 'Ko\'rsatilmagan'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Ro'l
                  </Typography>
                  <Typography variant="body1">
                    {profile.role}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Hisob Holati
                  </Typography>
                  <Typography variant="body1">
                    {profile.isActive ? 'Faol' : 'Nofaol'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Hisob ochilgan sana
                  </Typography>
                  <Typography variant="body1">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Oxirgi yangilangan
                  </Typography>
                  <Typography variant="body1">
                    {new Date(profile.updatedAt).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>

      <AvatarEditModal />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default AdminProfile;