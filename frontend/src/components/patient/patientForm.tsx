// src/components/admin-pages/AddUserPage.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { createUser } from '../../services/services';

const AddUserPage: React.FC = () => {
  const [form, setForm] = useState({
    fullName: '',
    lastName:'',
    email: '',
    temporaryPassword: '',
    role: 'user',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createUser(form);
      setSuccess('Foydalanuvchi muvaffaqiyatli qo‘shildi!');
      setForm({ fullName: '', email: '', temporaryPassword: '', lastName:'', role: '' });
    } catch (err: any) {
      console.error(err);
      setError('Foydalanuvchini qo‘shishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth="500px" mx="auto" mt={5}>
      <Typography variant="h4" gutterBottom>
        Yangi Foydalanuvchi Qo‘shish
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="F.I.Sh"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Parol"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          margin="normal"
          required
        />


        <Box mt={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Yuborilmoqda...' : 'Qo‘shish'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddUserPage;
