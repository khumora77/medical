import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Lock as LockIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../../store/adminStore";

const ChangePasswordPage: React.FC = () => {
  const { changePassword, isLoading, error, clearError } = useAdminStore();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validation errors ni tozalash
    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // Success message ni tozalash
    if (successMessage) {
      setSuccessMessage("");
    }

    // Error ni tozalash
    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    let isValid = true;

    // Joriy parolni tekshirish
    if (!passwords.currentPassword.trim()) {
      errors.currentPassword = "Joriy parolni kiriting";
      isValid = false;
    }

    // Yangi parolni tekshirish
    if (!passwords.newPassword.trim()) {
      errors.newPassword = "Yangi parolni kiriting";
      isValid = false;
    } else if (passwords.newPassword.length < 6) {
      errors.newPassword = "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
      isValid = false;
    } else if (passwords.newPassword === passwords.currentPassword) {
      errors.newPassword = "Yangi parol joriy paroldan farq qilishi kerak";
      isValid = false;
    }

    // Parolni tasdiqlashni tekshirish
    if (!passwords.confirmPassword.trim()) {
      errors.confirmPassword = "Parolni tasdiqlang";
      isValid = false;
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      errors.confirmPassword = "Parollar mos kelmadi";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await changePassword(passwords);
      setSuccessMessage(result.message || "Parol muvaffaqiyatli yangilandi!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // 3 soniyadan so'ng sahifani yangilash yoki boshqa sahifaga o'tish
      setTimeout(() => {
        // navigate('/profile'); // Profil sahifasiga o'tish
      }, 3000);
    } catch (error) {
      // Error store orqali avtomatik ko'rsatiladi
      console.error("Parol yangilashda xatolik:", error);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Orqaga qaytish
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              {/* Sarlavha */}
              <Box textAlign="center" mb={4}>
                <SecurityIcon
                  sx={{
                    fontSize: 64,
                    color: "primary.main",
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  fontWeight="bold"
                >
                  Update Password
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Update your password regularly to ensure your account
                  security.
                </Typography>
              </Box>

              {/* Xatolik va muvaffaqiyat xabarlari */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
                  {error}
                </Alert>
              )}

              {successMessage && (
                <Alert
                  severity="success"
                  sx={{ mb: 3 }}
                  onClose={() => setSuccessMessage("")}
                >
                  {successMessage}
                </Alert>
              )}

              {/* Parol yangilash formasi */}
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Joriy parol */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={passwords.currentPassword}
                      onChange={handleInputChange}
                      error={!!validationErrors.currentPassword}
                      helperText={validationErrors.currentPassword}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <LockIcon sx={{ mr: 1, color: "action.active" }} />
                        ),
                      }}
                    />
                  </Grid>

                  {/* Yangi parol */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={passwords.newPassword}
                      onChange={handleInputChange}
                      error={!!validationErrors.newPassword}
                      helperText={
                        validationErrors.newPassword ||
                        "Must be at least 8 characters long"
                      }
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <LockIcon sx={{ mr: 1, color: "action.active" }} />
                        ),
                      }}
                    />
                  </Grid>

                  {/* Parolni tasdiqlash */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={handleInputChange}
                      error={!!validationErrors.confirmPassword}
                      helperText={validationErrors.confirmPassword}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <LockIcon sx={{ mr: 1, color: "action.active" }} />
                        ),
                      }}
                    />
                  </Grid>



                  {/* Tugmalar */}
                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      gap={2}
                      justifyContent="flex-end"
                      flexWrap="wrap"
                    >
                      <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={isLoading}
                        size="large"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        size="large"
                        startIcon={
                          isLoading ? (
                            <CircularProgress size={20} />
                          ) : (
                            <SecurityIcon />
                          )
                        }
                      >
                        {isLoading ? "Loading..." : "Update Password"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChangePasswordPage;
