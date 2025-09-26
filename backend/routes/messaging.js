const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Sample messages log
let messages = [];

// Send SMS
router.post('/sms', async (req, res) => {
  const { to, message } = req.body;
  
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    
    const messageLog = {
      id: messages.length + 1,
      donor_id: null, // Will be linked to donor later
      message_type: 'sms',
      message_content: message,
      status: 'sent',
      sent_at: new Date()
    };
    
    messages.push(messageLog);
    res.json({ success: true, messageId: result.sid });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send WhatsApp message
router.post('/whatsapp', async (req, res) => {
  const { to, message } = req.body;
  
  try {
    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${to}`
    });
    
    const messageLog = {
      id: messages.length + 1,
      donor_id: null, // Will be linked to donor later
      message_type: 'whatsapp',
      message_content: message,
      status: 'sent',
      sent_at: new Date()
    };
    
    messages.push(messageLog);
    res.json({ success: true, messageId: result.sid });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get message history
router.get('/', (req, res) => {
  res.json(messages);
});

// Send reminder to donor
router.post('/reminder/:donorId', async (req, res) => {
  const { donorId } = req.params;
  const { messageType = 'sms' } = req.body;
  
  // In a real app, you'd fetch the donor from the database
  // For now, we'll use sample data
  const donor = {
    id: 1,
    name: 'أحمد محمد',
    phone: '0501234567'
  };
  
  const reminderMessage = `مرحباً ${donor.name}، تذكير بتجديد تبرعك. شكراً لدعمك لجمعية نماء الأهلية.`;
  
  try {
    let result;
    if (messageType === 'whatsapp') {
      result = await client.messages.create({
        body: reminderMessage,
        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
        to: `whatsapp:${donor.phone}`
      });
    } else {
      result = await client.messages.create({
        body: reminderMessage,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: donor.phone
      });
    }
    
    const messageLog = {
      id: messages.length + 1,
      donor_id: donorId,
      message_type: messageType,
      message_content: reminderMessage,
      status: 'sent',
      sent_at: new Date()
    };
    
    messages.push(messageLog);
    res.json({ success: true, messageId: result.sid });
  } catch (error) {
    console.error('Error sending reminder:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
