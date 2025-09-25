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
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";

const Auth = () => {
  const { login, user, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("admin@email.com"); // Test uchun
  const [password, setPassword] = useState("admin12345"); // Test uchun
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth komponenti yuklandi');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    console.log('isLoading:', isLoading);
    console.log('error:', error);
  }, [isAuthenticated, user, isLoading, error]);

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Redirect qilinmoqda, user role:', user.role);
      redirectBasedOnRole(user.role);
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) {
      console.log('Error yangilandi:', error);
      setLocalError(error);
    }
  }, [error]);

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
        navigate('/dashboard');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login boshladi');
    setLocalError("");
    clearError();

    const em = email.trim();
    const pw = password.trim();

    console.log('Email va password:', { em, pw });

    if (!em || !pw) {
      setLocalError("Email va parolni kiriting.");
      return;
    }

    if (!em.includes('@')) {
      setLocalError("To'g'ri email manzilini kiriting.");
      return;
    }

    try {
      console.log('Login funksiyasi chaqirilmoqda...');
      const userData = await login({ email: em, password: pw });
      console.log('Login muvaffaqiyatli tamomlandi:', userData);
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
            Tizimga Kirish (Debug Mode)
          </Typography>

          
          <Box sx={{ mb: 2, p: 1, background: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Status: {isLoading ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </Typography>
          </Box>

          {(error || localError) && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              onClose={() => {
                clearError();
                setLocalError("");
              }}
            >
              {error || localError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
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
              label="Parol"
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
              {isLoading ? <CircularProgress size={24} /> : "Kirish (Debug)"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Auth;