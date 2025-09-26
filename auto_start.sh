#!/bin/bash

# تطبيق جمعية نماء الأهلية - ملف التشغيل التلقائي
echo "🚀 بدء تشغيل تطبيق جمعية نماء الأهلية..."

# التحقق من وجود Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت. يرجى تثبيت Node.js أولاً"
    exit 1
fi

# التحقق من وجود XAMPP
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL غير متاح. يرجى تشغيل XAMPP أولاً"
    echo "   افتح XAMPP وشغل خدمة MySQL"
    exit 1
fi

echo "✅ المتطلبات متوفرة"

# إنشاء قاعدة البيانات إذا لم تكن موجودة
echo "📊 إعداد قاعدة البيانات..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS namaa_db;"

# الانتقال للمجلد الخلفي وتثبيت التبعيات
echo "🔧 تثبيت تبعيات الخادم الخلفي..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi

# الانتقال للمجلد الأمامي وتثبيت التبعيات
echo "🎨 تثبيت تبعيات الواجهة الأمامية..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
fi

# تشغيل الخادم الخلفي في الخلفية
echo "⚙️ تشغيل الخادم الخلفي..."
cd ../backend
npm start &
BACKEND_PID=$!

# انتظار ثانيتين للتأكد من تشغيل الخادم الخلفي
sleep 2

# تشغيل الواجهة الأمامية
echo "🌐 تشغيل الواجهة الأمامية..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 تم تشغيل التطبيق بنجاح!"
echo ""
echo "📱 للوصول للتطبيق:"
echo "   افتح المتصفح واذهب إلى: http://localhost:3000"
echo ""
echo "👤 بيانات تسجيل الدخول:"
echo "   اسم المستخدم: admin"
echo "   كلمة المرور: admin123"
echo ""
echo "🛑 لإيقاف التطبيق:"
echo "   اضغط Ctrl+C"
echo ""
echo "📞 للمساعدة: راجع ملف QUICK_START.md"

# انتظار إيقاف المستخدم
wait $BACKEND_PID $FRONTEND_PID