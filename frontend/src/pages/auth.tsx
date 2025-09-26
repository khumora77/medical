import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";

const Auth = () => {
  const { login, user, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("admin@pc.local");
  const [password, setPassword] = useState("admin123");
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth komponenti yuklandi', {
      isAuthenticated,
      user,
      isLoading,
      error
    });

    if (isAuthenticated && user) {
      console.log('Redirect qilinmoqda, user role:', user.role);
      redirectBasedOnRole(user.role);
    }
  }, [isAuthenticated, user, navigate]);

  const redirectBasedOnRole = (role: string) => {
    console.log('redirectBasedOnRole ishga tushdi:', role);
    switch (role) {
      case 'admin':
        navigate('/dashboard');
        break;
      case 'doctor':
        navigate('/doctor');
        break;
      case 'reception':
        navigate('/reception');
        break;
      default:
        navigate('/');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login boshladi');
    setLocalError("");
    clearError();

    const em = email.trim();
    const pw = password.trim();

    if (!em || !pw) {
      setLocalError("Email va parolni kiriting.");
      return;
    }

    try {
      console.log('Login funksiyasi chaqirilmoqda...');
      await login({ email: em, password: pw });
      console.log('Login muvaffaqiyatli tamomlandi');
    } catch (error: any) {
      console.error('Login catch blokida xato:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1976d2, #42a5f5)",
          padding: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 3,
            textAlign: "center",
            background: "white",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2", mb: 1 }}>
            MedTech
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, color: "text.secondary" }}>
            SignIn
          </Typography>

          <Box sx={{ mb: 2, p: 2, background: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Status: {isLoading ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              User: {user ? user.email : 'None'}
            </Typography>
          </Box>

          {(error || localError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || localError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Kirish"}
            </Button>
          </Box>

          
        </Paper>
      </Box>
    </Container>
  );
};

export default Auth;