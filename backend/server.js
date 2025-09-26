// 4. تحديث ملف backend/server.js لتفعيل تحسينات الأداء والأمان

// ... الكود الحالي ...

// استيراد مكتبات الأمان والأداء
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { cacheMiddleware, clearAllCache } = require('./middleware/cache');

const app = express();

// 1. إعدادات الأمان الأساسية
app.use(helmet());

// 2. ضغط الاستجابات
app.use(compression());

// 3. الحد من معدل الطلبات
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // حد 100 طلب لكل نافذة
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'لقد تجاوزت عدد الطلبات المسموح بها، يرجى المحاولة لاحقاً' }
});

// تطبيق الحد على جميع طلبات API
app.use('/api/', limiter);

// ... بقية الاستيرادات ...

// 4. تطبيق التخزين المؤقت على طلبات GET
app.get('*', cacheMiddleware(300)); // 5 دقائق تخزين مؤقت

// ... بقية الكود ...

// نقطة نهاية لمسح ذاكرة التخزين المؤقت (للمشرفين فقط)
app.post('/api/clear-cache', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'غير مصرح' });
  }
  
  const count = clearAllCache();
  res.json({ 
    success: true, 
    message: `تم مسح ${count} عنصر من ذاكرة التخزين المؤقت`
  });
});
