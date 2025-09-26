const express = require('express');
const router = express.Router();
const db = require('../server');

// Get all tasks
router.get('/', (req, res) => {
  const query = 'SELECT * FROM tasks ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get task by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM tasks WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching task:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(results[0]);
  });
});

// Get users list for task assignment
router.get('/users/list', (req, res) => {
  const query = 'SELECT id, username, role FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Create new task
router.post('/', (req, res) => {
  const { title, description, assigned_to, status, due_date } = req.body;

  const query = `INSERT INTO tasks (title, description, assigned_to, status, due_date)
                 VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [title, description, assigned_to, status, due_date], (err, results) => {
    if (err) {
      console.error('Error creating task:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, message: 'Task created successfully' });
  });
});

// Update task
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, assigned_to, status, due_date } = req.body;

  const query = `UPDATE tasks SET title = ?, description = ?, assigned_to = ?,
                 status = ?, due_date = ? WHERE id = ?`;

  db.query(query, [title, description, assigned_to, status, due_date, id], (err, results) => {
    if (err) {
      console.error('Error updating task:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task updated successfully' });
  });
});

// Update task status
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = 'UPDATE tasks SET status = ? WHERE id = ?';

  db.query(query, [status, id], (err, results) => {
    if (err) {
      console.error('Error updating task status:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task status updated successfully' });
  });
});

// Delete task
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM tasks WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

module.exports = router;
