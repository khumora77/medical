// components/PatientsList.tsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import type { Patient, PatientsResponse } from '../../types/patient';
import { patientService } from '../../services/services';
import PatientForm from './patientForm';


const PatientsList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response: PatientsResponse = await patientService.getPatients(
        page,
        10,
        search,
        genderFilter
      );
      setPatients(response.data);
      setTotalPages(response.pages);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [page, search, genderFilter]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleGenderFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGenderFilter(event.target.value);
    setPage(1);
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setOpenDialog(true);
  };

  const handleAddNew = () => {
    setSelectedPatient(null);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
  };

  const handleSaveSuccess = () => {
    handleDialogClose();
    loadPatients();
  };

  const handleDeleteClick = (patientId: string) => {
    setPatientToDelete(patientId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (patientToDelete) {
      try {
        await patientService.deletePatient(patientToDelete);
        setDeleteDialogOpen(false);
        setPatientToDelete(null);
        loadPatients();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPatientToDelete(null);
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'male': return 'Erkak';
      case 'female': return 'Ayol';
      case 'other': return 'Boshqa';
      default: return gender;
    }
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  if (loading && patients.length === 0) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          Bemorlar Ro'yxati
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Yangi Bemor
        </Button>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Filter va qidiruv */}
      <Paper className="p-4 mb-6">
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField
            label="Qidirish"
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon className="text-gray-400 mr-2" />,
            }}
            placeholder="Ism, familiya, telefon yoki email"
          />
          <TextField
            select
            label="Jins bo'yicha filter"
            value={genderFilter}
            onChange={handleGenderFilterChange}
            variant="outlined"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="male">Man</MenuItem>
            <MenuItem value="female">Woman</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* Jadval */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-bold">Name</TableCell>
              <TableCell className="font-bold">Telephone</TableCell>
              <TableCell className="font-bold">Email</TableCell>
              <TableCell className="font-bold">Jins</TableCell>
              <TableCell className="font-bold">Holati</TableCell>
              <TableCell className="font-bold">Qo'shilgan sana</TableCell>
              <TableCell className="font-bold text-center">Amallar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient._id} hover>
                <TableCell>
                  <Typography variant="subtitle2" className="font-medium">
                    {patient.firstName} {patient.lastName}
                  </Typography>
                </TableCell>
                <TableCell>{formatPhone(patient.phone)}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>
                  <Chip
                    label={getGenderText(patient.gender)}
                    size="small"
                    color={
                      patient.gender === 'male' ? 'primary' : 
                      patient.gender === 'female' ? 'secondary' : 'default'
                    }
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={patient.isActive ? 'Faol' : 'Nofaol'}
                    color={patient.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(patient.createdAt).toLocaleDateString('uz-UZ')}
                </TableCell>
                <TableCell className="text-center">
                  <Box className="flex justify-center space-x-1">
                    <Tooltip title="Ko'rish">
                      <IconButton size="small" color="info">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Tahrirlash">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEdit(patient)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="O'chirish">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteClick(patient._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? "contained" : "outlined"}
              onClick={() => setPage(pageNum)}
              className={pageNum === page ? "bg-blue-600" : ""}
            >
              {pageNum}
            </Button>
          ))}
        </Box>
      )}

      {/* Bemor form dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPatient ? 'Bemorni Tahrirlash' : 'Yangi Bemor Qoʻshish'}
        </DialogTitle>
        <DialogContent>
          <PatientForm
            patient={selectedPatient}
            onSave={handleSaveSuccess}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>

      {/* O'chirish tasdiqlash dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Bemorni O'chirish</DialogTitle>
        <DialogContent>
          <Typography>Haqiqatan ham bu bemorni o'chirmoqchimisiz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Bekor qilish</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            O'chirish
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PatientsList;