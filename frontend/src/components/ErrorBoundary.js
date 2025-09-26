// 21. إنشاء ملف ErrorBoundary.js
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // يمكنك إرسال الخطأ لخدمة تسجيل الأخطاء
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, FallbackComponent } = this.props;

    if (hasError) {
      // عرض مكون الخطأ المخصص
      if (FallbackComponent) {
        return <FallbackComponent error={error} onReset={this.handleReset} />;
      }
      
      // عرض رسالة الخطأ الافتراضية
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>حدث خطأ غير متوقع</h2>
          <p>نعتذر عن حدوث خطأ. يرجى تحديث الصفحة أو المحاولة لاحقاً.</p>
          <button onClick={this.handleReset}>إعادة المحاولة</button>
          <details style={{ marginTop: '20px', textAlign: 'left' }}>
            <summary>تفاصيل الخطأ</summary>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {error?.toString() || 'لا توجد تفاصيل إضافية'}
            </pre>
          </details>
        </div>
      );
    }

    return children;
  }
}

// القيم الافتراضية للخصائص
ErrorBoundary.defaultProps = {
  FallbackComponent: null,
};
