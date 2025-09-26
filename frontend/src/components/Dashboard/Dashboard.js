// 1. تثبيت المكتبات المطلوبة
// قم بتشغيل الأوامر التالية في مجلد frontend:
// npm install @mui/x-charts recharts date-fns

// 2. إنشاء ملف src/components/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { 
  Grid, Paper, Typography, Box, 
  Card, CardContent, CardHeader, Divider
} from '@mui/material';
import { 
  People as PeopleIcon, 
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { LineChart, PieChart, Pie, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

// بيانات وهمية للعرض (يجب استبدالها ببيانات حقيقية من API)
const mockData = {
  stats: {
    totalDonors: 1242,
    totalDonations: 1250000,
    completedTasks: 89,
    activeCampaigns: 5
  },
  monthlyDonations: [
    { name: 'يناير', amount: 100000 },
    { name: 'فبراير', amount: 150000 },
    { name: 'مارس', amount: 120000 },
    { name: 'إبريل', amount: 180000 },
    { name: 'مايو', amount: 200000 },
    { name: 'يونيو', amount: 250000 },
    { name: 'يوليو', amount: 250000 },
  ],
  donationTypes: [
    { name: 'زكاة', value: 45 },
    { name: 'صدقة', value: 30 },
    { name: 'كفالة', value: 15 },
    { name: 'أخرى', value: 10 },
  ],
  recentActivities: [
    { id: 1, title: 'تمت إضافة متبرع جديد', time: 'منذ 5 دقائق', type: 'donor' },
    { id: 2, title: 'تم استلام تبرع جديد', time: 'منذ ساعة', type: 'donation' },
    { id: 3, title: 'تم إكمال المهمة #123', time: 'منذ 3 ساعات', type: 'task' },
    { id: 4, title: 'إشعار جديد من الإدارة', time: 'منذ يوم', type: 'notification' },
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card sx={{ height: '100%', borderLeft: `4px solid ${color}` }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <div>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4">
            {value}
          </Typography>
        </div>
        <Box
          sx={{
            backgroundColor: `${color}20`,
            borderRadius: '50%',
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color
          }}
        >
          <Icon fontSize="large" />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const ActivityItem = ({ title, time, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'donor':
        return <PeopleIcon color="primary" />;
      case 'donation':
        return <MoneyIcon color="success" />;
      case 'task':
        return <CheckCircleIcon color="info" />;
      default:
        return <NotificationsIcon color="warning" />;
    }
  };

  return (
    <Box display="flex" alignItems="center" mb={2}>
      <Box mr={2}>
        {getIcon()}
      </Box>
      <Box flexGrow={1}>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="caption" color="textSecondary">
          {time}
        </Typography>
      </Box>
    </Box>
  );
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: جلب البيانات الفعلية من API
    const fetchData = async () => {
      try {
        // const response = await axios.get('/api/dashboard');
        // setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Typography>جاري التحميل...</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        لوحة التحكم
      </Typography>
      
      {/* إحصائيات سريعة */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="إجمالي المتبرعين" 
            value={mockData.stats.totalDonors.toLocaleString()} 
            icon={PeopleIcon} 
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="إجمالي التبرعات" 
            value={`${mockData.stats.totalDonations.toLocaleString()} ر.س`} 
            icon={MoneyIcon} 
            color="#2196F3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="المهام المكتملة" 
            value={`${mockData.stats.completedTasks}%`} 
            icon={CheckCircleIcon} 
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="الحملات النشطة" 
            value={mockData.stats.activeCampaigns} 
            icon={NotificationsIcon} 
            color="#E91E63"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* رسم بياني التبرعات الشهرية */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader 
              title="التبرعات الشهرية" 
              subheader={`آخر تحديث: ${format(new Date(), 'dd MMMM yyyy', { locale: arSA })}`}
            />
            <Divider />
            <CardContent sx={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.monthlyDonations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} ر.س`, 'المبلغ']} />
                  <Legend />
                  <Bar dataKey="amount" name="المبلغ" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* توزيع التبرعات حسب النوع */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="توزيع التبرعات" />
            <Divider />
            <CardContent sx={{ height: 350, display: 'flex', flexDirection: 'column' }}>
              <Box flexGrow={1}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockData.donationTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {mockData.donationTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'النسبة']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* آخر النشاطات */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="آخر النشاطات" />
            <Divider />
            <CardContent>
              {mockData.recentActivities.map((activity) => (
                <ActivityItem 
                  key={activity.id}
                  title={activity.title}
                  time={activity.time}
                  type={activity.type}
                />
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
