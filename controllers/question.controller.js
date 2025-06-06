const pool = require('../config/db');

// Create Question with Options
const addQuestion = async (req, res) => {
  try {
    const { test_id, question, type, noOfAnswer, options, incorrect_hint = "" } = req.body;

    if (!test_id || !question || !type || !noOfAnswer || !options || options.length === 0) {
      return res.status(400).json({ message: 'All fields and at least one option are required' });
    }

    const [test] = await pool.query('SELECT * FROM tests WHERE id = ?', [test_id]);
    if (test.length === 0) {
      return res.status(404).json({ message: 'Test not found' });
    }

    const [existingQuestion] = await pool.query(
      'SELECT * FROM questions WHERE test_id = ? AND LOWER(question) = LOWER(?)',
      [test_id, question]
    );
    if (existingQuestion.length > 0) {
      return res.status(400).json({ message: 'Question with this text already exists in this test' });
    }

    const [result] = await pool.query(
      'INSERT INTO questions (test_id, question, type, noOfAnswer, incorrect_hint) VALUES (?, ?, ?, ?, ?)',
      [test_id, question, type, noOfAnswer, incorrect_hint]
    );

    const questionId = result.insertId;

    const optionPromises = options.map(opt => {
      return pool.query(
        'INSERT INTO options (question_id, option_text, isAnswer) VALUES (?, ?, ?)',
        [questionId, opt.option, opt.isAnswer]
      );
    });

    await Promise.all(optionPromises);

    res.status(201).json({ message: 'Question and options added successfully' });
  } catch (error) {
    console.error('Add Question Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Get All Questions by Test ID
const getQuestionsByTest = async (req, res) => {
  try {
    const { testId } = req.params;

    const [questions] = await pool.query('SELECT * FROM questions WHERE test_id = ?', [testId]);

    const questionWithOptions = await Promise.all(
      questions.map(async (q) => {
        const [options] = await pool.query(
          'SELECT id, option_text AS `option`, isAnswer FROM options WHERE question_id = ?',
          [q.id]
        );
        return {
          id: q.id,
          question: q.question,
          type: q.type,
          noOfAnswer: q.noOfAnswer,
          incorrect_hint: q.incorrect_hint,
          options: options
        };
      })
    );

    res.status(200).json(questionWithOptions);
  } catch (error) {
    console.error('Get Questions Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Update Question and Options
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, type, noOfAnswer, options, incorrect_hint = "" } = req.body;

    const [q] = await pool.query('SELECT * FROM questions WHERE id = ?', [id]);
    if (q.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await pool.query(
      'UPDATE questions SET question = ?, type = ?, noOfAnswer = ?, incorrect_hint = ? WHERE id = ?',
      [question, type, noOfAnswer, incorrect_hint, id]
    );

    if (options && options.length > 0) {
      await pool.query('DELETE FROM options WHERE question_id = ?', [id]);

      const optionPromises = options.map(opt => {
        return pool.query(
          'INSERT INTO options (question_id, option_text, isAnswer) VALUES (?, ?, ?)',
          [id, opt.option, opt.isAnswer]
        );
      });

      await Promise.all(optionPromises);
    }

    res.status(200).json({ message: 'Question updated successfully' });
  } catch (error) {
    console.error('Update Question Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Delete Question (and its options)
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const [q] = await pool.query('SELECT * FROM questions WHERE id = ?', [id]);
    if (q.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await pool.query('DELETE FROM questions WHERE id = ?', [id]);

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Delete Question Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Bulk Add Questions
const bulkAddQuestions = async (req, res) => {
  try {
    const { testId } = req.params;
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Questions array is required' });
    }

    const [test] = await pool.query('SELECT * FROM tests WHERE id = ?', [testId]);
    if (test.length === 0) {
      return res.status(404).json({ message: 'Test not found' });
    }

    for (const q of questions) {
      const { question, type, noOfAnswer, options, incorrect_hint = "" } = q;

      if (!question || !type || !noOfAnswer || !options || options.length === 0) {
        return res.status(400).json({ message: 'Each question must have question, type, noOfAnswer, and at least one option' });
      }

      const [existingQuestion] = await pool.query(
        'SELECT * FROM questions WHERE test_id = ? AND LOWER(question) = LOWER(?)',
        [testId, question]
      );
      if (existingQuestion.length > 0) {
        continue;
      }

      const [result] = await pool.query(
        'INSERT INTO questions (test_id, question, type, noOfAnswer, incorrect_hint) VALUES (?, ?, ?, ?, ?)',
        [testId, question, type, noOfAnswer, incorrect_hint]
      );

      const questionId = result.insertId;

      const optionPromises = options.map(opt => {
        return pool.query(
          'INSERT INTO options (question_id, option_text, isAnswer) VALUES (?, ?, ?)',
          [questionId, opt.option, opt.isAnswer]
        );
      });

      await Promise.all(optionPromises);
    }

    res.status(201).json({ message: 'Bulk questions inserted successfully (skipped duplicates).' });
  } catch (error) {
    console.error('Bulk Add Questions Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = {
  addQuestion,
  getQuestionsByTest,
  updateQuestion,
  deleteQuestion,
  bulkAddQuestions
};