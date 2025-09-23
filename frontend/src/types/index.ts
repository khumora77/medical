// ==================== AUTH TYPES ====================
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  specialization?: string; // Doctor uchun
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'ADMIN' | 'DOCTOR' | 'RECEPTION';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  specialization?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ==================== PATIENT TYPES ====================
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth?: string;
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  bloodType?: BloodType;
  allergies?: string[];
  medicalHistory?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type BloodType = 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 
                       'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE';

export interface CreatePatientData {
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth?: string;
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  bloodType?: BloodType;
  allergies?: string[];
  medicalHistory?: string;
  notes?: string;
}

export interface UpdatePatientData extends Partial<CreatePatientData> {
  id?: string;
}

export interface PatientStats {
  totalPatients: number;
  lastWeekPatients: number;
  patientsByGender: { gender: Gender; count: number }[];
  patientsByAgeGroup: { group: string; count: number }[];
}

// ==================== APPOINTMENT TYPES ====================
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  startAt: string;
  endAt: string;
  status: AppointmentStatus;
  reason: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  patient?: Patient;
  doctor?: User;
  createdByUser?: User;
}

export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface CreateAppointmentData {
  patientId: string;
  doctorId: string;
  startAt: string;
  endAt: string;
  reason: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  status?: AppointmentStatus;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  startAt?: string;
  endAt?: string;
}

export interface AppointmentSlot {
  start: Date;
  end: Date;
  available: boolean;
  doctorId?: string;
}

export interface DailyAppointments {
  date: string;
  appointments: Appointment[];
  total: number;
  completed: number;
  cancelled: number;
}

// ==================== MEDICAL RECORD TYPES ====================
export interface MedicalRecord {
  id: string;
  patientId: string;
  authorId: string;
  type: MedicalRecordType;
  title: string;
  description: string;
  diagnosis?: string;
  prescription?: string;
  symptoms?: string[];
  vitalSigns?: VitalSigns;
  labResults?: LabResult[];
  attachments?: Attachment[];
  followUpDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  patient?: Patient;
  author?: User;
}

export type MedicalRecordType = 'CONSULTATION' | 'DIAGNOSIS' | 'PRESCRIPTION' | 'LAB_RESULT' | 'SURGERY' | 'VACCINATION' | 'OTHER';

export interface VitalSigns {
  bloodPressure?: string; // "120/80"
  heartRate?: number; // BPM
  temperature?: number; // Celsius
  respiratoryRate?: number; // Breaths per minute
  oxygenSaturation?: number; // Percentage
  height?: number; // cm
  weight?: number; // kg
  bmi?: number; // Body Mass Index
}

export interface LabResult {
  testName: string;
  result: string;
  unit?: string;
  normalRange?: string;
  flag?: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  notes?: string;
}

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface CreateMedicalRecordData {
  patientId: string;
  type: MedicalRecordType;
  title: string;
  description: string;
  diagnosis?: string;
  prescription?: string;
  symptoms?: string[];
  vitalSigns?: VitalSigns;
  labResults?: LabResult[];
  followUpDate?: string;
  notes?: string;
}

export interface UpdateMedicalRecordData extends Partial<CreateMedicalRecordData> {
  id?: string;
}

// ==================== DASHBOARD TYPES ====================
export interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  revenue?: number;
  patientGrowth: number;
  appointmentTrends: TrendData[];
  topDoctors: DoctorStats[];
}

export interface TrendData {
  date: string;
  value: number;
  label: string;
}

export interface DoctorStats {
  doctorId: string;
  doctorName: string;
  appointmentCount: number;
  patientCount: number;
  specialization: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'APPOINTMENT' | 'SURGERY' | 'MEETING';
  status: AppointmentStatus;
  patientName?: string;
  doctorName?: string;
  color?: string;
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

// ==================== FORM & UI TYPES ====================
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  startDate?: string;
  endDate?: string;
  status?: string;
  doctorId?: string;
  patientId?: string;
}

export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
}

// ==================== NOTIFICATION TYPES ====================
export interface Notification {
  id: string;
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ==================== SETTINGS TYPES ====================
export interface ClinicSettings {
  clinicName: string;
  address: string;
  phone: string;
  email: string;
  workingHours: WorkingHours;
  appointmentDuration: number; // minutes
  maxAppointmentsPerDay: number;
  emergencyContact: string;
}

export interface WorkingHours {
  [key: string]: { // day of week: 0-6 (Sunday-Saturday)
    open: string; // HH:mm
    close: string; // HH:mm
    closed: boolean;
  };
}

export interface UserPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

// ==================== ENUM MAPPINGS ====================
export const GenderLabels: Record<Gender, string> = {
  MALE: 'Erkak',
  FEMALE: 'Ayol',
  OTHER: 'Boshqa'
};

export const BloodTypeLabels: Record<BloodType, string> = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-'
};

export const AppointmentStatusLabels: Record<AppointmentStatus, string> = {
  SCHEDULED: 'Rejalashtirilgan',
  CONFIRMED: 'Tasdiqlangan',
  IN_PROGRESS: 'Jarayonda',
  COMPLETED: 'Yakunlangan',
  CANCELLED: 'Bekor qilingan',
  NO_SHOW: 'Kelishmagan'
};

export const AppointmentStatusColors: Record<AppointmentStatus, string> = {
  SCHEDULED: '#1976d2', // Blue
  CONFIRMED: '#2e7d32', // Green
  IN_PROGRESS: '#ed6c02', // Orange
  COMPLETED: '#388e3c', // Dark Green
  CANCELLED: '#d32f2f', // Red
  NO_SHOW: '#757575' // Gray
};

export const MedicalRecordTypeLabels: Record<MedicalRecordType, string> = {
  CONSULTATION: 'Konsultatsiya',
  DIAGNOSIS: 'Tashxis',
  PRESCRIPTION: 'Retsept',
  LAB_RESULT: 'Lab natijasi',
  SURGERY: 'Jarrohlik',
  VACCINATION: 'Vaksinatsiya',
  OTHER: 'Boshqa'
};

export const UserRoleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrator',
  DOCTOR: 'Shifokor',
  RECEPTION: 'Qabulxona'
};

// ==================== UTILITY TYPES ====================
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> 
  & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys];

export type Nullable<T> = T | null;

// ==================== COMPONENT PROP TYPES ====================
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
}

export interface ConfirmDialogProps extends ModalProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  severity?: 'error' | 'warning' | 'info' | 'success';
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  debounceMs?: number;
}

// ==================== EXPORT ALL TYPES ====================
export * from './api.types.ts';
export * from './form.types.ts';