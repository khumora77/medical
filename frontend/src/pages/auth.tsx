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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    if (isAuthenticated && user) {
      redirectBasedOnRole(user.role);
    }
  }, [isAuthenticated, user, navigate]);

  const redirectBasedOnRole = (role: string) => {
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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    const em = email.trim();
    const pw = password.trim();

  
    if (!em || !pw) {
      setLocalError("Email va parolni kiriting.");
      return;
    }

    if (!em.includes('@')) {
      setLocalError("To'g'ri email manzilini kiriting.");
      return;
    }

    try {
      const userData = await login({ email: em, password: pw });
      
      console.log('Login successful:', userData);
      
    } catch (error: any) {
      
      console.error('Login error:', error);
    }
  };

 
  const showDemoCredentials = process.env.NODE_ENV === 'development';

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
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ width: "100%" }}
        >
          <Paper
            elevation={6}
            sx={{
              padding: 4,
              borderRadius: 3,
              textAlign: "center",
              background: "white",
              position: "relative",
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2", mb: 1 }}>
                MedTech
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, color: "text.secondary" }}>
                SignIn
              </Typography>
            </motion.div>


            {(error || localError) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ mb: 2 }}
                  onClose={clearError}
                >
                  {error || localError}
                </Alert>
              </motion.div>
            )}

            <Box
              component="form"
              onSubmit={handleLogin}
              sx={{ mt: 1 }}
              autoComplete="on"
            >
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLocalError("");
                    clearError();
                  }}
                  disabled={isLoading}
                />
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLocalError("");
                    clearError();
                  }}
                  disabled={isLoading}
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ 
                    mt: 3, 
                    mb: 2, 
                    py: 1.5, 
                    fontWeight: "bold",
                    fontSize: "1.1rem"
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "SignIn"
                  )}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mt: 2 }}
                >
                  MedTech
                </Typography>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Auth;