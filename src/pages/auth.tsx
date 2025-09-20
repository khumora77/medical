import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
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

    console.log("Login attempt:", { em, pw }); 

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
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
           MedTech 
          </Typography>
          <Typography component="h2" variant="h5" align="center" gutterBottom>
            Sign In
          </Typography>

          {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
            />
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
              onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Auth;
