import React, { useState } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Paper, Divider
} from '@mui/material';
import { Print, PictureAsPdf } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const PrintDialog = ({ open, onClose, type = 'report', data = null }) => {
  const { t } = useTranslation();
  const [includeLogo, setIncludeLogo] = useState(true);
  const [includeHeader, setIncludeHeader] = useState(true);

  const handlePrint = () => {
    const printContent = document.getElementById('print-content');
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleExportPDF = () => {
    // In a real application, you would use a library like jsPDF or Puppeteer
    alert('سيتم تصدير PDF قريباً - يتطلب مكتبة إضافية');
  };

  const renderReportContent = () => (
    <Box id="print-content" sx={{ p: 3, fontFamily: 'Arial, sans-serif' }}>
      {includeHeader && (
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            جمعية نماء الأهلية
          </Typography>
          <Typography variant="h6" color="text.secondary">
            تقرير التبرعات والأنشطة
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date().toLocaleDateString('ar-SA')}
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>إحصائيات التبرعات</Typography>
            <Typography>إجمالي المتبرعين: {data?.totalDonors || 0}</Typography>
            <Typography>إجمالي التبرعات: {data?.totalDonations?.toFixed(2) || 0} ريال</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>إحصائيات المهام</Typography>
            <Typography>إجمالي المهام: {data?.totalTasks || 0}</Typography>
            <Typography>المكتملة: {data?.completedTasks || 0}</Typography>
            <Typography>المعلقة: {data?.pendingTasks || 0}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>أحدث المتبرعين</Typography>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>الاسم</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>نوع التبرع</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>المبلغ</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>تاريخ البداية</th>
            </tr>
          </thead>
          <tbody>
            {(data?.recentDonors || []).slice(0, 5).map((donor, index) => (
              <tr key={index}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{donor.name}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{donor.donation_type}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{donor.amount}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{donor.start_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );

  const renderCardContent = () => (
    <Box id="print-content" sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {Array.from({ length: 6 }, (_, index) => (
          <Grid item xs={6} sm={4} key={index}>
            <Paper sx={{
              p: 2,
              textAlign: 'center',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              {includeLogo && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="h6" color="primary">جمعية نماء الأهلية</Typography>
                </Box>
              )}
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  بطاقة شكر وتقدير
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">
                  نشكركم على تبرعكم السخي
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  ونسأل الله أن يجعلها في ميزان حسناتكم
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {new Date().toLocaleDateString('ar-SA')}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        خيارات الطباعة - {type === 'report' ? 'التقرير' : 'البطاقات'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            خيارات الطباعة:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <label>
              <input
                type="checkbox"
                checked={includeHeader}
                onChange={(e) => setIncludeHeader(e.target.checked)}
              />
              تضمين الرأس والتاريخ
            </label>
            <label>
              <input
                type="checkbox"
                checked={includeLogo}
                onChange={(e) => setIncludeLogo(e.target.checked)}
              />
              تضمين الشعار
            </label>
          </Box>
        </Box>

        {type === 'report' ? renderReportContent() : renderCardContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          إلغاء
        </Button>
        <Button
          onClick={handleExportPDF}
          startIcon={<PictureAsPdf />}
          variant="outlined"
        >
          تصدير PDF
        </Button>
        <Button
          onClick={handlePrint}
          variant="contained"
          startIcon={<Print />}
          color="primary"
        >
          طباعة
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintDialog;
