const express = require('express');
const router = express.Router();
const db = require('../server');

// Get all donors
router.get('/', (req, res) => {
  const query = 'SELECT * FROM donors ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching donors:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get donor by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM donors WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching donor:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Donor not found' });
    }
    res.json(results[0]);
  });
});

// Create new donor
router.post('/', (req, res) => {
  const { name, phone, donation_type, amount, start_date, end_date, notes } = req.body;

  // Calculate remaining days
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const remainingDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  const query = `INSERT INTO donors (name, phone, donation_type, amount, start_date, end_date, remaining_days, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [name, phone, donation_type, amount, start_date, end_date, remainingDays, notes], (err, results) => {
    if (err) {
      console.error('Error creating donor:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, message: 'Donor created successfully' });
  });
});

// Update donor
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone, donation_type, amount, start_date, end_date, notes } = req.body;

  // Calculate remaining days
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const remainingDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  const query = `UPDATE donors SET name = ?, phone = ?, donation_type = ?, amount = ?,
                 start_date = ?, end_date = ?, remaining_days = ?, notes = ? WHERE id = ?`;

  db.query(query, [name, phone, donation_type, amount, start_date, end_date, remainingDays, notes, id], (err, results) => {
    if (err) {
      console.error('Error updating donor:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Donor not found' });
    }
    res.json({ message: 'Donor updated successfully' });
  });
});

// Delete donor
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM donors WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting donor:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Donor not found' });
    }
    res.json({ message: 'Donor deleted successfully' });
  });
});

module.exports = router;
