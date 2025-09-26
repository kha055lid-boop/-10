import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

// تحميل المكونات بكسل (Lazy Loading)
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const DonorList = lazy(() => import('./components/DonorList'));
const AddDonor = lazy(() => import('./components/AddDonor'));
const Login = lazy(() => import('./components/Login'));
const TaskList = lazy(() => import('./components/TaskList'));
const Reports = lazy(() => import('./components/Reports'));

// مؤشر تحميل أثناء جلب المكونات
const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
    <CircularProgress />
  </Box>
);

function App() {
  const { t, i18n } = useTranslation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const drawerContent = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Typography variant="h6" sx={{ px: 2, mb: 2, textAlign: 'center' }}>
        {t('appTitle')}
      </Typography>
      <List>
        <ListItem button component="a" href="/dashboard">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary={t('dashboard')} />
        </ListItem>
        <ListItem button component="a" href="/donors">
          <ListItemIcon><People /></ListItemIcon>
          <ListItemText primary={t('donorList')} />
        </ListItem>
        <ListItem button component="a" href="/add-donor">
          <ListItemIcon><PersonAdd /></ListItemIcon>
          <ListItemText primary={t('addDonor')} />
        </ListItem>
        <ListItem button component="a" href="/tasks">
          <ListItemIcon><Task /></ListItemIcon>
          <ListItemText primary={t('taskList')} />
        </ListItem>
        <ListItem button component="a" href="/reports">
          <ListItemIcon><Assessment /></ListItemIcon>
          <ListItemText primary={t('reports')} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div className="App" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <AppBar position="static" sx={{ backgroundColor: '#7B68EE' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={toggleDrawer} edge="start">
            <Menu />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t('appTitle')}
          </Typography>
          <Button color="inherit" onClick={() => changeLanguage('ar')}>
            العربية
          </Button>
          <Button color="inherit" onClick={() => changeLanguage('en')}>
            English
          </Button>
          <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
            {t('logout')}
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor={i18n.language === 'ar' ? 'right' : 'left'} open={drawerOpen} onClose={toggleDrawer}>
        {drawerContent}
      </Drawer>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/donors" element={<DonorList />} />
            <Route path="/add-donor" element={<AddDonor />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Suspense>
      </Container>
    </div>
  );
}

export default App;
