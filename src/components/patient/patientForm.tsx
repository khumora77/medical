// components/PatientForm.tsx
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Box,
  MenuItem,
  Alert,
  CircularProgress,
  Typography,
  Paper,
} from '@mui/material';
import type { Patient, PatientFormData } from '../../types/patient';
import { patientService } from '../../services/services';


interface PatientFormProps {
  patient?: Patient | null;
  onSave: () => void;
  onCancel: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onSave, onCancel }) => {
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: '',
    lastName: '',
    gender: 'male',
    phone: '',
    email: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName,
        lastName: patient.lastName,
        gender: patient.gender,
        phone: patient.phone,
        email: patient.email,
        notes: patient.notes || '',
        dateOfBirth: patient.dateOfBirth,
        address: patient.address,
        emergencyContact: patient.emergencyContact,
        insuranceInfo: patient.insuranceInfo,
      });
    }
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof PatientFormData],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (patient) {
        await patientService.updatePatient(patient._id, formData);
      } else {
        await patientService.createPatient(formData);
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="py-4">
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Asosiy ma'lumotlar */}
        <Grid item xs={12}>
          <Paper className="p-4 mb-4">
            <Typography variant="h6" className="mb-4 font-bold">
              Asosiy Ma'lumotlar
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  variant="outlined"
                >
                  <MenuItem value="male">Man</MenuItem>
                  <MenuItem value="female">Woman</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefon"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Qo'shimcha ma'lumotlar"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Manzil ma'lumotlari */}
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4 font-bold">
              Manzil
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ko'cha"
                  value={formData.address?.street || ''}
                  onChange={(e) => handleNestedChange('address', 'street', e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Shahar"
                  value={formData.address?.city || ''}
                  onChange={(e) => handleNestedChange('address', 'city', e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Viloyat"
                  value={formData.address?.state || ''}
                  onChange={(e) => handleNestedChange('address', 'state', e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Pochta indeksi"
                  value={formData.address?.zipCode || ''}
                  onChange={(e) => handleNestedChange('address', 'zipCode', e.target.value)}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Favqulodda aloqa */}
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4 font-bold">
              Favqulodda Aloqa
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.emergencyContact?.name || ''}
                  onChange={(e) => handleNestedChange('emergencyContact', 'name', e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Number"
                  value={formData.emergencyContact?.phone || ''}
                  onChange={(e) => handleNestedChange('emergencyContact', 'phone', e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Call"
                  value={formData.emergencyContact?.relationship || ''}
                  onChange={(e) => handleNestedChange('emergencyContact', 'relationship', e.target.value)}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Sug'urta ma'lumotlari */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4 font-bold">
              Sug'urta Ma'lumotlari
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Sug'urta provayderi"
                  value={formData.insuranceInfo?.provider || ''}
                  onChange={(e) => handleNestedChange('insuranceInfo', 'provider', e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Polis raqami"
                  value={formData.insuranceInfo?.policyNumber || ''}
                  onChange={(e) => handleNestedChange('insuranceInfo', 'policyNumber', e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Guruh raqami"
                  value={formData.insuranceInfo?.groupNumber || ''}
                  onChange={(e) => handleNestedChange('insuranceInfo', 'groupNumber', e.target.value)}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Box className="flex justify-end space-x-2 mt-6">
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? <CircularProgress size={24} /> : (patient ? 'Saqlash' : 'Qoʻshish')}
        </Button>
      </Box>
    </Box>
  );
};

export default PatientForm;