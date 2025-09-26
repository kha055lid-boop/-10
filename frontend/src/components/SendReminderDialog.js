import React, { useState } from 'react';
import { 
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, TextField, Alert
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const SendReminderDialog = ({ donor, open, onClose }) => {
  const { t } = useTranslation();
  const [messageType, setMessageType] = useState('sms');
  const [customMessage, setCustomMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const defaultMessages = {
    sms: `مرحباً ${donor?.name}، تذكير بتجديد تبرعك. شكراً لدعمك لجمعية نماء الأهلية.`,
    whatsapp: `مرحباً ${donor?.name}، تذكير بتجديد تبرعك. شكراً لدعمك لجمعية نماء الأهلية.`
  };

  const handleSend = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    const message = customMessage || defaultMessages[messageType];
    
    try {
      await axios.post(`/api/messaging/reminder/${donor.id}`, {
        messageType
      });
      setSuccess('تم إرسال التذكير بنجاح!');
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);
    } catch (error) {
      setError('فشل في إرسال التذكير. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCustomMessage('');
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>إرسال تذكير للمتبرع</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
          <InputLabel>نوع الرسالة</InputLabel>
          <Select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            label="نوع الرسالة"
          >
            <MenuItem value="sms">SMS</MenuItem>
            <MenuItem value="whatsapp">WhatsApp</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label="نص الرسالة"
          value={customMessage || defaultMessages[messageType]}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="اكتب رسالة مخصصة أو استخدم الرسالة الافتراضية"
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="رقم الهاتف"
          value={donor?.phone || ''}
          InputProps={{ readOnly: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          إلغاء
        </Button>
        <Button 
          onClick={handleSend} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? 'جاري الإرسال...' : 'إرسال'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendReminderDialog;
