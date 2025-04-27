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

const getLessonsByChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;

    const [lessons] = await pool.query('SELECT id, chapter_id, title, htmlContent, created_at FROM lessons WHERE chapter_id = ?', [chapterId]);

    res.status(200).json(lessons);
  } catch (error) {
    console.error('Get Lessons Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, htmlContent } = req.body;

    const [lesson] = await pool.query('SELECT * FROM lessons WHERE id = ?', [id]);
    if (lesson.length === 0) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const fields = [];
    const values = [];

    if (title) {
      fields.push('title = ?');
      values.push(title);
    }
    if (htmlContent) {
      fields.push('htmlContent = ?');
      values.push(htmlContent);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    values.push(id); // where id = ?

    await pool.query(`UPDATE lessons SET ${fields.join(', ')} WHERE id = ?`, values);

    res.status(200).json({ message: 'Lesson updated successfully' });
  } catch (error) {
    console.error('Update Lesson Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const [lesson] = await pool.query('SELECT * FROM lessons WHERE id = ?', [id]);
    if (lesson.length === 0) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    await pool.query('DELETE FROM lessons WHERE id = ?', [id]);

    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Delete Lesson Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};


module.exports = { addLesson, getLessonsByChapter, updateLesson, deleteLesson  };