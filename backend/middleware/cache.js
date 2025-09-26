// 1. إنشاء ملف backend/middleware/cache.js
const NodeCache = require('node-cache');

// إنشاء ذاكرة تخزين مؤقت جديدة مع فترة صلاحية افتراضية 10 دقائق
const cache = new NodeCache({ stdTTL: 600 });

// وسيط التخزين المؤقت
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    // تجاهل طلبات POST, PUT, DELETE, PATCH
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      return next();
    }

    // إنشاء مفتاح فريد لكل طلب بناءً على الرابط والمعلمات
    const key = req.originalUrl || req.url;
    
    // محاولة جلب البيانات من الذاكرة المؤقتة
    const cachedResponse = cache.get(key);
    
    // إذا وجدت البيانات في الذاكرة المؤقتة، قم بإرجاعها
    if (cachedResponse) {
      console.log('Cache hit:', key);
      return res.send(JSON.parse(cachedResponse));
    }
    
    // إذا لم تكن البيانات موجودة، قم بتخزين النسخة الأصلية من دالة الإرسال
    const originalSend = res.send;
    
    // تجاوز دالة الإرسال لتخزين الاستجابة في الذاكرة المؤقتة
    res.send = (body) => {
      // تخزين الاستجابة في الذاكرة المؤقتة
      if (res.statusCode === 200) {
        cache.set(key, body, duration || 600); // افتراضي 10 دقائق
      }
      // استدعاء دالة الإرسال الأصلية
      return originalSend.call(res, body);
    };
    
    // المتابعة إلى معالج الطلب التالي
    next();
  };
};

// دالة لمسح عناصر محددة من الذاكرة المؤقتة
const clearCache = (key) => {
  return cache.del(key);
};

// دالة لمسح الذاكرة المؤقتة بالكامل
const clearAllCache = () => {
  return cache.flushAll();
};

module.exports = { cacheMiddleware, clearCache, clearAllCache, cache };
