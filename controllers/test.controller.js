const pool = require('../config/db');

// Create Test
const addTest = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Check for duplicate title
    const [existingTest] = await pool.query('SELECT * FROM tests WHERE LOWER(title) = LOWER(?)', [title]);
    if (existingTest.length > 0) {
      return res.status(400).json({ message: 'Test with this title already exists' });
    }

    await pool.query(
      'INSERT INTO tests (title, description) VALUES (?, ?)',
      [title, description]
    );

    res.status(201).json({ message: 'Test added successfully' });
  } catch (error) {
    console.error('Add Test Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Get All Tests
const getAllTests = async (req, res) => {
  try {
    const [tests] = await pool.query('SELECT id, title, description, created_at FROM tests ORDER BY created_at DESC');
    res.status(200).json(tests);
  } catch (error) {
    console.error('Get All Tests Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Get Single Test
const getTestById = async (req, res) => {
  try {
    const { id } = req.params;

    const [test] = await pool.query('SELECT id, title, description, created_at FROM tests WHERE id = ?', [id]);
    if (test.length === 0) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.status(200).json(test[0]);
  } catch (error) {
    console.error('Get Test Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Update Test
const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const [test] = await pool.query('SELECT * FROM tests WHERE id = ?', [id]);
    if (test.length === 0) {
      return res.status(404).json({ message: 'Test not found' });
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

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    values.push(id);

    await pool.query(`UPDATE tests SET ${fields.join(', ')} WHERE id = ?`, values);

    res.status(200).json({ message: 'Test updated successfully' });
  } catch (error) {
    console.error('Update Test Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Delete Test
const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    const [test] = await pool.query('SELECT * FROM tests WHERE id = ?', [id]);
    if (test.length === 0) {
      return res.status(404).json({ message: 'Test not found' });
    }

    await pool.query('DELETE FROM tests WHERE id = ?', [id]);

    res.status(200).json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error('Delete Test Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = { addTest, getAllTests, getTestById, updateTest, deleteTest };