// 9. إنشاء ملف backend/middleware/errorHandler.js
const logger = require('../utils/logger');
const AppError = require('../utils/appError');

// معالجة أخطاء Mongoose
const handleCastErrorDB = (err) => {
  const message = `قيمة غير صالحة: ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `قيمة مكررة للحقل: ${value}. الرجاء استخدام قيمة أخرى.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `بيانات الإدخال غير صالحة. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// معالجة أخطاء JWT
const handleJWTError = () =>
  new AppError('رمز الدخول غير صالح، يرجى تسجيل الدخول مرة أخرى', 401);

const handleJWTExpiredError = () =>
  new AppError('انتهت صلاحية جلسة الدخول، يرجى تسجيل الدخول مرة أخرى', 401);

// إرسال الأخطاء في وضع التطوير
const sendErrorDev = (err, req, res) => {
  // واجهة برمجة التطبيقات
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  
  // واجهة المستخدم
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'حدث خطأ!',
    msg: err.message,
  });
};

// إرسال الأخطاء في وضع الإنتاج
const sendErrorProd = (err, req, res) => {
  // واجهة برمجة التطبيقات
  if (req.originalUrl.startsWith('/api')) {
    // الأخطاء المتوقعة، إرسال رسالة الخطأ للعميل
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    
    // البرمجة أو الأخطاء غير المعروفة، لا تسرب تفاصيل الخطأ
    logger.error('ERROR 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'حدث خطأ ما!',
    });
  }
  
  // واجهة المستخدم
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'حدث خطأ!',
      msg: err.message,
    });
  }
  
  // البرمجة أو الأخطاء غير المعروفة، لا تسرب تفاصيل الخطأ
  logger.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'حدث خطأ!',
    msg: 'الرجاء المحاولة مرة أخرى لاحقاً.',
  });
};

// معالج الأخطاء المركزي
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
