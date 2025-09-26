// 7. إنشاء ملف backend/utils/security.js
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const { body, validationResult } = require('express-validator');

// 1. إعدادات الأمان الأساسية
const securityMiddleware = [
  // إضافة رؤوس أمان HTTP
  helmet(),
  
  // منع تلوث المعلمات (Parameter Pollution)
  hpp(),
  
  // تنظيف مدخلات المستخدم من هجمات XSS
  xss(),
  
  // تنظيف مدخلات MongoDB
  mongoSanitize(),
  
  // منع استدعاء iframe من نطاقات أخرى
  (req, res, next) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  }
];

// 2. التحقق من صحة مدخلات المستخدم
const validateInput = (rules) => {
  return [
    // تطبيق قواعد التحقق
    ...rules,
    
    // معالجة الأخطاء
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          errors: errors.array().map(err => ({
            field: err.param,
            message: err.msg
          }))
        });
      }
      next();
    }
  ];
};

// 3. تحديد معدل الطلبات المسموح به
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // 100 طلب لكل نافذة
  message: {
    status: 'error',
    message: 'لقد تجاوزت عدد الطلبات المسموح بها، يرجى المحاولة لاحقاً'
  }
});

// 4. التحقق من الصلاحيات
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'ليس لديك صلاحية للوصول إلى هذا المورد'
      });
    }
    next();
  };
};

// 5. تشفير البيانات الحساسة
const encryptSensitiveData = (data) => {
  // تنفيذ خوارزمية تشفير قوية
  // يمكن استخدام مكتبة مثل crypto-js أو bcrypt
  return data; // مؤقت - يجب استبداله بالتشفير الفعلي
};

module.exports = {
  securityMiddleware,
  validateInput,
  rateLimiter,
  restrictTo,
  encryptSensitiveData
};
