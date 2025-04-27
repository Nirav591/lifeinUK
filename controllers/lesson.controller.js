const pool = require('../config/db');

const addLesson = async (req, res) => {
  try {
    const { chapter_id, title, htmlContent } = req.body;

    if (!chapter_id || !title || !htmlContent) {
      return res.status(400).json({ message: 'Chapter ID, title, and HTML content are required' });
    }

    // Check if chapter exists
    const [chapter] = await pool.query('SELECT * FROM chapters WHERE id = ?', [chapter_id]);
    if (chapter.length === 0) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    await pool.query(
      'INSERT INTO lessons (chapter_id, title, htmlContent) VALUES (?, ?, ?)',
      [chapter_id, title, htmlContent]
    );

    res.status(201).json({ message: 'Lesson added successfully' });
  } catch (error) {
    console.error('Add Lesson Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = { addLesson };