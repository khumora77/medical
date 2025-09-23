// Form-specific types

export interface FormFieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => string | null;
}

export interface FormField<T = any> {
  name: keyof T;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'time' | 'datetime' | 
        'select' | 'multiselect' | 'textarea' | 'checkbox' | 'radio' | 'file';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: any; label: string }>;
  validation?: FormFieldValidation;
  helperText?: string;
}

export interface FormState<T = any> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
}

export interface FormProps<T = any> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validationSchema?: any; // Yup schema yoki custom validation
  children: React.ReactNode;
  disabled?: boolean;
}

// Specific form types
export interface PatientFormData {
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  bloodType?: 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 
              'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE';
  allergies: string[];
  medicalHistory?: string;
  notes?: string;
}

export interface AppointmentFormData {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  notes?: string;
  duration: number; // minutes
}

export interface MedicalRecordFormData {
  type: 'CONSULTATION' | 'DIAGNOSIS' | 'PRESCRIPTION' | 'LAB_RESULT' | 'SURGERY' | 'VACCINATION' | 'OTHER';
  title: string;
  description: string;
  diagnosis?: string;
  prescription?: string;
  symptoms: string[];
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
  };
  followUpDate?: string;
  notes?: string;
}