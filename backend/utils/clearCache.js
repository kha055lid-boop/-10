// 3. إنشاء ملف backend/utils/clearCache.js
const { clearAllCache } = require('../middleware/cache');

console.log('Clearing all cache...');
const count = clearAllCache();
console.log(`Cache cleared. Removed ${count} items.`);

// تصدير الدوال للاستخدام في ملفات أخرى
module.exports = { clearAll: clearAllCache };
