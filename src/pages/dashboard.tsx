import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  PersonAdd as PersonAddIcon,
  EventAvailable as EventAvailableIcon,
} from "@mui/icons-material";

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
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h5">{stats.todayAppointments}</Typography>
                  <Typography color="textSecondary">
                    Today's Appointments
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PersonAddIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h5">{stats.newPatients}</Typography>
                  <Typography color="textSecondary">
                    New Patients (Last 7 days)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h5">
                    {stats.userAppointments.length}
                  </Typography>
                  <Typography color="textSecondary">
                    Upcoming Appointments
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <EventAvailableIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Upcoming Appointments</Typography>
            </Box>
            {stats.userAppointments.length > 0 ? (
              <List>
                {stats.userAppointments.map((appt) => (
                  <ListItem key={appt.id}>
                    <ListItemText
                      primary={appt.patientName}
                      secondary={`Time: ${appt.time}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary">
                No upcoming appointments
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
