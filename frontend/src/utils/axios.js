// 22. تحديث ملف axios.js لتحسين معالجة الأخطاء
import axios from 'axios';
import { showError } from './utils/notifications';

// إنشاء نسخة مخصصة من axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 ثواني
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة معالج للطلبات
api.interceptors.request.use(
  (config) => {
    // إضافة التوكن للرؤوس إذا كان متوفراً
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// إضافة معالج للاستجابات
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // معالجة أخطاء الشبكة
    if (!error.response) {
      showError('خطأ في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.');
      return Promise.reject({ message: 'خطأ في الاتصال بالخادم' });
    }

    const { status, data } = error.response;
    let errorMessage = 'حدث خطأ غير متوقع';

    // معالجة رموز الحالة المختلفة
    switch (status) {
      case 400:
        errorMessage = data.message || 'طلب غير صالح';
        break;
      case 401:
        errorMessage = 'غير مصرح بالوصول. يرجى تسجيل الدخول مرة أخرى';
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        errorMessage = 'غير مسموح لك بالوصول إلى هذا المورد';
        break;
      case 404:
        errorMessage = 'الملف المطلوب غير موجود';
        break;
      case 500:
        errorMessage = 'حدث خطأ في الخادم الداخلي';
        break;
      default:
        errorMessage = data.message || errorMessage;
    }

    // عرض رسالة الخطأ للمستخدم
    showError(errorMessage);
    
    // إرجاع الخطأ للمعالجة الإضافية
    return Promise.reject({
      status,
      message: errorMessage,
      data: data?.errors || null,
    });
  }
);

export default api;
