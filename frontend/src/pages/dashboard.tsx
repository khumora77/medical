import React, { useEffect, useState } from "react";
import {

  Typography,
  Box,

} from "@mui/material";

import StatsDashboard from "../components/dashboard/dashboard";
import VisitorInsightsDashboard from "../components/dashboard/chart";


interface Appointment {
  id: number;
  patientName: string;
  time: string;
}

interface DashboardStats {
  todayAppointments: number;
  newPatients: number;
  userAppointments: Appointment[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    todayAppointments: 0,
    newPatients: 0,
    userAppointments: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
    
        setStats({
          todayAppointments: 5,
          newPatients: 12,
          userAppointments: [
            { id: 1, patientName: "John Doe", time: "10:00 AM" },
            { id: 2, patientName: "Jane Smith", time: "2:30 PM" },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom className="text-center font-bold">
        Admin Dashboard
      </Typography>


      <StatsDashboard/>
      <VisitorInsightsDashboard/>
    </Box>
  );
};

export default Dashboard;
