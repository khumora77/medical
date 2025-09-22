// types/doctor.ts
export interface DoctorStats {
  totalPatients: number;
  todayAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
}

export interface TodaySchedule {
  morning: Appointment[];
  afternoon: Appointment[];
  evening: Appointment[];
}