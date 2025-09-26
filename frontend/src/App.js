// 20. تحديث ملف App.js للتعامل مع الروابط بشكل صحيح
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

// استيراد المكونات بشكل متأخر
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const DonorList = lazy(() => import('./components/DonorList'));
const TaskList = lazy(() => import('./components/TaskList'));
const Reports = lazy(() => import('./components/Reports'));
const ErrorBoundary = lazy(() => import('./components/ErrorBoundary'));

// عنصر تحميل أثناء التحميل
const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
    <CircularProgress />
  </Box>
);

// مكون مجمع للأخطاء
const ErrorFallback = () => (
  <Box p={3}>
    <Typography variant="h6" color="error">
      حدث خطأ في تحميل الصفحة. يرجى تحديث الصفحة أو المحاولة لاحقاً.
    </Typography>
  </Box>
);

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/donors" element={<DonorList />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
