import React, { useState } from "react";
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
import { useAuthState } from "../store/auth-store";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { setAuth } = useAuthState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const em = email.trim();
    const pw = password.trim();

    try {
      if (em === "admin@gmail.com" && pw === "admin1234") {
        setAuth({ email: em, role: "admin" });
        navigate("/dashboard");
      } else if (em === "doctor@gmail.com" && pw === "doctor1234") {
        setAuth({ email: em, role: "doctor" });
        navigate("/doctor");
      } else if (em === "reception@gmail.com" && pw === "reception1234") {
        setAuth({ email: em, role: "reception" });
        navigate("/reception");
      } else {
        setErrorMsg("Email yoki parol noto‘g‘ri.");
      }
    } catch (error: any) {
      setErrorMsg("Xatolik yuz berdi: " + (error.message || error));
    } finally {
      setLoading(false);
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
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                MedTech
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, color: "text.secondary" }}>
                Sign In
              </Typography>
            </motion.div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMsg}
                </Alert>
              </motion.div>
            )}

            <Box
              component="form"
              onSubmit={handleLogin}
              sx={{ mt: 1 }}
              autoComplete="off"
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
                  label="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg("");
                  }}
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
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg("");
                  }}
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: "bold" }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                </Button>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Auth;
