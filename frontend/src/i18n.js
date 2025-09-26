import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: {
          welcome: "مرحباً بك في جمعية نماء الأهلية",
          donors: "المتبرعون",
          addDonor: "إضافة متبرع",
          name: "الاسم",
          phone: "رقم الجوال",
          donationType: "نوع التبرع",
          amount: "المبلغ",
          startDate: "تاريخ البداية",
          endDate: "تاريخ النهاية",
          remainingDays: "الأيام المتبقية",
          notes: "الملاحظات",
          save: "حفظ",
          cancel: "إلغاء",
          login: "تسجيل الدخول",
          logout: "تسجيل الخروج",
        }
      },
      en: {
        translation: {
          welcome: "Welcome to Namaa Charity Association",
          donors: "Donors",
          addDonor: "Add Donor",
          name: "Name",
          phone: "Phone Number",
          donationType: "Donation Type",
          amount: "Amount",
          startDate: "Start Date",
          endDate: "End Date",
          remainingDays: "Remaining Days",
          notes: "Notes",
          save: "Save",
          cancel: "Cancel",
          login: "Login",
          logout: "Logout",
        }
      }
    },
    lng: 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
