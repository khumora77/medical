// API-specific types

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface QueryParams {
  [key: string]: string | number | boolean | undefined | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, any>;
}

// API Endpoint response types
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'DOCTOR' | 'RECEPTION';
    phone?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PatientsResponse {
  patients: Array<{
    id: string;
    firstName: string;
    lastName: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phone: string;
    email?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AppointmentsResponse {
  appointments: Array<{
    id: string;
    patientId: string;
    doctorId: string;
    startAt: string;
    endAt: string;
    status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    reason: string;
    patient: {
      id: string;
      firstName: string;
      lastName: string;
      phone: string;
    };
    doctor: {
      id: string;
      firstName: string;
      lastName: string;
      specialization?: string;
    };
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}