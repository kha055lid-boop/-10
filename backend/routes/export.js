const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Export donors to Excel
router.get('/export/donors', (req, res) => {
  // In a real app, you'd fetch from database
  const donors = [
    {
      id: 1,
      name: 'أحمد محمد',
      phone: '0501234567',
      donation_type: 'تبرع شهري',
      amount: 500.00,
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      remaining_days: 99,
      notes: 'متبرع منتظم'
    },
    {
      id: 2,
      name: 'فاطمة علي',
      phone: '0509876543',
      donation_type: 'تبرع لمرة واحدة',
      amount: 1000.00,
      start_date: '2024-09-01',
      end_date: '2024-09-30',
      remaining_days: 6,
      notes: 'تبرع لمشروع تعليمي'
    }
  ];

  try {
    // Create workbook and worksheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(donors);

    // Add worksheet to workbook
    xlsx.utils.book_append_sheet(wb, ws, 'Donors');

    // Generate buffer
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Set headers and send file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=donors.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Error exporting donors:', error);
    res.status(500).json({ message: 'Error exporting data' });
  }
});

// Import donors from Excel
router.post('/import/donors', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read the uploaded file
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Process and validate data
    const importedDonors = jsonData.map((row, index) => ({
      id: Date.now() + index, // Generate unique ID
      name: row.name || row.الاسم || '',
      phone: row.phone || row.رقم_الهاتف || '',
      donation_type: row.donation_type || row.نوع_التبرع || 'تبرع شهري',
      amount: parseFloat(row.amount || row.المبلغ || 0),
      start_date: row.start_date || row.تاريخ_البداية || new Date().toISOString().split('T')[0],
      end_date: row.end_date || row.تاريخ_النهاية || new Date().toISOString().split('T')[0],
      notes: row.notes || row.ملاحظات || '',
      remaining_days: Math.ceil((new Date(row.end_date || row.تاريخ_النهاية) - new Date(row.start_date || row.تاريخ_البداية)) / (1000 * 60 * 60 * 24))
    }));

    // In a real app, you'd save to database here
    console.log('Imported donors:', importedDonors);

    res.json({
      message: 'تم استيراد البيانات بنجاح',
      importedCount: importedDonors.length,
      donors: importedDonors
    });
  } catch (error) {
    console.error('Error importing donors:', error);
    res.status(500).json({ message: 'Error importing data' });
  }
});

// Export tasks to Excel
router.get('/export/tasks', (req, res) => {
  const tasks = [
    {
      id: 1,
      title: 'متابعة المتبرعين الجدد',
      description: 'مراجعة قائمة المتبرعين الجدد وإرسال رسائل ترحيب',
      assigned_to: 'أحمد محمد',
      status: 'pending',
      due_date: '2024-09-25',
      created_at: '2024-09-24T10:00:00Z'
    },
    {
      id: 2,
      title: 'إعداد تقرير شهري',
      description: 'إعداد التقرير الشهري للتبرعات والأنشطة',
      assigned_to: 'فاطمة علي',
      status: 'in_progress',
      due_date: '2024-09-30',
      created_at: '2024-09-24T10:00:00Z'
    }
  ];

  try {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(tasks);
    xlsx.utils.book_append_sheet(wb, ws, 'Tasks');

    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=tasks.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Error exporting tasks:', error);
    res.status(500).json({ message: 'Error exporting data' });
  }
});

// Export reports
router.get('/export/reports', (req, res) => {
  const reportData = {
    summary: {
      totalDonors: 150,
      totalDonations: 75000,
      totalTasks: 25,
      completedTasks: 18
    },
    monthlyStats: [
      { month: 'يناير', donors: 12, donations: 5000 },
      { month: 'فبراير', donors: 15, donations: 7500 },
      { month: 'مارس', donors: 18, donations: 9000 },
      { month: 'أبريل', donors: 20, donations: 10000 }
    ]
  };

  try {
    const wb = xlsx.utils.book_new();

    // Summary sheet
    const summaryWs = xlsx.utils.json_to_sheet([reportData.summary]);
    xlsx.utils.book_append_sheet(wb, summaryWs, 'Summary');

    // Monthly stats sheet
    const monthlyWs = xlsx.utils.json_to_sheet(reportData.monthlyStats);
    xlsx.utils.book_append_sheet(wb, monthlyWs, 'Monthly Stats');

    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=reports.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Error exporting reports:', error);
    res.status(500).json({ message: 'Error exporting data' });
  }
});

module.exports = router;
