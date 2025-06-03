const pool = require('../config/db');

// Create Exam
const addExam = async (req, res) => {
  try {
    const { title, description, duration } = req.body;

    if (!title || !duration) {
      return res.status(400).json({ message: 'Title and duration are required' });
    }

    const [existingExam] = await pool.query('SELECT * FROM exams WHERE LOWER(title) = LOWER(?)', [title]);
    if (existingExam.length > 0) {
      return res.status(400).json({ message: 'Exam with this title already exists' });
    }

    await pool.query(
      'INSERT INTO exams (title, description, duration) VALUES (?, ?, ?)',
      [title, description, duration]
    );

    res.status(201).json({ message: 'Exam added successfully' });
  } catch (error) {
    console.error('Add Exam Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Get All Exams
const getAllExams = async (req, res) => {
  try {
    const [exams] = await pool.query('SELECT id, title, description, duration, created_at FROM exams ORDER BY created_at DESC');
    res.status(200).json(exams);
  } catch (error) {
    console.error('Get All Exams Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Get Single Exam
const getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    const [exam] = await pool.query('SELECT id, title, description, duration, created_at FROM exams WHERE id = ?', [id]);
    if (exam.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.status(200).json(exam[0]);
  } catch (error) {
    console.error('Get Exam Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Update Exam
const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration } = req.body;

    const [exam] = await pool.query('SELECT * FROM exams WHERE id = ?', [id]);
    if (exam.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const fields = [];
    const values = [];

    if (title) {
      fields.push('title = ?');
      values.push(title);
    }
    if (description) {
      fields.push('description = ?');
      values.push(description);
    }
    if (duration) {
      fields.push('duration = ?');
      values.push(duration);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    values.push(id);

    await pool.query(`UPDATE exams SET ${fields.join(', ')} WHERE id = ?`, values);

    res.status(200).json({ message: 'Exam updated successfully' });
  } catch (error) {
    console.error('Update Exam Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Delete Exam
const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    const [exam] = await pool.query('SELECT * FROM exams WHERE id = ?', [id]);
    if (exam.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    await pool.query('DELETE FROM exams WHERE id = ?', [id]);

    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Delete Exam Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = { addExam, getAllExams, getExamById, updateExam, deleteExam };