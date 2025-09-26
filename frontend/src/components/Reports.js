import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  FormControl, InputLabel, Select, MenuItem, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Reports = () => {
  const { t } = useTranslation();
  const [donors, setDonors] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [donorsRes, tasksRes] = await Promise.all([
        axios.get('/api/donors'),
        axios.get('/api/tasks')
      ]);
      setDonors(donorsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Calculate donation statistics
  const donationStats = React.useMemo(() => {
    const totalDonations = donors.reduce((sum, donor) => sum + parseFloat(donor.amount), 0);
    const donationTypes = donors.reduce((acc, donor) => {
      acc[donor.donation_type] = (acc[donor.donation_type] || 0) + 1;
      return acc;
    }, {});

    const typeData = Object.entries(donationTypes).map(([name, value]) => ({
      name: name,
      value: value
    }));

    return {
      totalDonations,
      totalDonors: donors.length,
      typeData
    };
  }, [donors]);

  // Calculate task statistics
  const taskStats = React.useMemo(() => {
    const statusCount = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.entries(statusCount).map(([name, value]) => ({
      name: getStatusLabel(name),
      value: value
    }));

    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;

    return {
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks,
      statusData
    };
  }, [tasks]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'مكتملة';
      case 'in_progress': return 'قيد التنفيذ';
      case 'pending': return 'معلقة';
      default: return status;
    }
  };

  const COLORS = ['#7B68EE', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        التقارير والإحصائيات
      </Typography>

      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>الفترة الزمنية</InputLabel>
        <Select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          label="الفترة الزمنية"
        >
          <MenuItem value="week">أسبوعي</MenuItem>
          <MenuItem value="month">شهري</MenuItem>
          <MenuItem value="quarter">ربع سنوي</MenuItem>
          <MenuItem value="year">سنوي</MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        {/* Donation Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                إحصائيات التبرعات
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" color="primary">
                    {donationStats.totalDonors}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    إجمالي المتبرعين
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" color="primary">
                    {donationStats.totalDonations.toFixed(2)} ريال
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    إجمالي التبرعات
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Task Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                إحصائيات المهام
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="h4" color="primary">
                    {taskStats.totalTasks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    إجمالي المهام
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h4" color="success.main">
                    {taskStats.completedTasks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    مكتملة
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h4" color="warning.main">
                    {taskStats.pendingTasks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    معلقة
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Donation Types Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                توزيع أنواع التبرعات
              </Typography>
              <PieChart width={400} height={300}>
                <Pie
                  data={donationStats.typeData}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {donationStats.typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>

        {/* Task Status Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                حالة المهام
              </Typography>
              <BarChart width={400} height={300} data={taskStats.statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#7B68EE" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Donors Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                أحدث المتبرعين
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>الاسم</TableCell>
                      <TableCell>نوع التبرع</TableCell>
                      <TableCell>المبلغ</TableCell>
                      <TableCell>تاريخ البداية</TableCell>
                      <TableCell>تاريخ النهاية</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {donors.slice(0, 5).map((donor) => (
                      <TableRow key={donor.id}>
                        <TableCell>{donor.name}</TableCell>
                        <TableCell>{donor.donation_type}</TableCell>
                        <TableCell>{donor.amount}</TableCell>
                        <TableCell>{donor.start_date}</TableCell>
                        <TableCell>{donor.end_date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
