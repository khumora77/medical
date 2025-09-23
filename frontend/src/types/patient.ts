// types/patient.ts
export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  notes?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  insuranceInfo?: {
    provider?: string;
    policyNumber?: string;
    groupNumber?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  notes?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  insuranceInfo?: {
    provider?: string;
    policyNumber?: string;
    groupNumber?: string;
  };
}

export interface PatientsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Patient[];
}
export interface Appointment {
  id: string;
  patientName: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
}

export interface AppointmentFormData {
  patientName: string;
  date: string;
  time: string;
  reason: string;
}