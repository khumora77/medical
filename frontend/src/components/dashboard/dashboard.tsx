import React, { useState, useEffect } from 'react';

// Define TypeScript interfaces
interface Appointment {
  id: string;
  patientName: string;
  dateTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  doctor: string;
}

interface Patient {
  id: string;
  name: string;
  joinDate: string;
  doctor: string;
}

interface User {
  id: string;
  name: string;
  role: 'doctor' | 'admin';
}

const StatsDashboard: React.FC = () => {
  // Mock user data (in a real app, this would come from authentication)
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    name: 'Dr. John Smith',
    role: 'doctor'
  });

  // Mock appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', patientName: 'Alice Johnson', dateTime: '2023-05-15T09:00:00', status: 'scheduled', doctor: '1' },
    { id: '2', patientName: 'Bob Williams', dateTime: '2023-05-15T10:30:00', status: 'scheduled', doctor: '1' },
    { id: '3', patientName: 'Carol Davis', dateTime: '2023-05-15T14:00:00', status: 'scheduled', doctor: '2' },
    { id: '4', patientName: 'David Brown', dateTime: '2023-05-16T11:00:00', status: 'scheduled', doctor: '1' },
    { id: '5', patientName: 'Eva Miller', dateTime: '2023-05-16T13:30:00', status: 'scheduled', doctor: '1' },
  ]);

  // Mock patients data
  const [patients, setPatients] = useState<Patient[]>([
    { id: '1', name: 'Alice Johnson', joinDate: '2023-05-10', doctor: '1' },
    { id: '2', name: 'Bob Williams', joinDate: '2023-05-12', doctor: '1' },
    { id: '3', name: 'Carol Davis', joinDate: '2023-05-08', doctor: '2' },
    { id: '4', name: 'David Brown', joinDate: '2023-05-13', doctor: '1' },
    { id: '5', name: 'Eva Miller', joinDate: '2023-05-09', doctor: '1' },
    { id: '6', name: 'Frank Wilson', joinDate: '2023-05-07', doctor: '2' },
  ]);

  // State for filtered data based on user role
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  // Calculate stats
  const todaysAppointmentsCount = filteredAppointments.filter(apt => {
    const aptDate = new Date(apt.dateTime).toDateString();
    const today = new Date().toDateString();
    return aptDate === today;
  }).length;

  // Calculate new patients in last 7 days
  const newPatientsCount = filteredPatients.filter(patient => {
    const joinDate = new Date(patient.joinDate);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return joinDate >= weekAgo;
  }).length;

  // Filter data based on user role
  useEffect(() => {
    if (currentUser.role === 'doctor') {
      // For doctors, only show their own appointments and patients
      setFilteredAppointments(appointments.filter(apt => apt.doctor === currentUser.id));
      setFilteredPatients(patients.filter(patient => patient.doctor === currentUser.id));
    } else {
      // For admins, show all data
      setFilteredAppointments(appointments);
      setFilteredPatients(patients);
    }
  }, [currentUser, appointments, patients]);

  // Quick list for doctor (today's appointments)
  const todaysAppointments = filteredAppointments.filter(apt => {
    const aptDate = new Date(apt.dateTime).toDateString();
    const today = new Date().toDateString();
    return aptDate === today;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Medical Dashboard</h1>
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-600">Welcome, {currentUser.name}</p>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {currentUser.role === 'doctor' ? 'Doctor' : 'Administrator'}
            </span>
          </div>
        </header>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Appointments Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-medium text-gray-600 mb-2">Today's Appointments</h3>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-blue-600">{todaysAppointmentsCount}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Scheduled for today</p>
          </div>
          
          {/* New Patients Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-medium text-gray-600 mb-2">New Patients (Last 7 Days)</h3>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-green-600">{newPatientsCount}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Recently registered patients</p>
          </div>
          
          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-medium text-gray-600 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                Schedule Appointment
              </button>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                Add New Patient
              </button>
            </div>
          </div>
        </div>
        
        {/* Quick List Section (for doctors) */}
        {currentUser.role === 'doctor' && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Appointments</h2>
            {todaysAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {todaysAppointments.map(apt => (
                      <tr key={apt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{apt.patientName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${apt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                              apt.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No appointments scheduled for today.</p>
            )}
          </div>
        )}
        
        {/* Recent Patients Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Patients</h2>
          {filteredPatients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.slice(0, 5).map(patient => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(patient.joinDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No patients found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;