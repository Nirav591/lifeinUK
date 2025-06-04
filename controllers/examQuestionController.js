const pool = require('../config/db');

// Create Question for Exam (exam_questions)
const addExamQuestion = async (req, res) => {
  try {
    const { exam_id, question, type, noOfAnswer, options, incorrect_hint = "" } = req.body;

    if (!exam_id || !question || !type || !noOfAnswer || !options || options.length === 0) {
      return res.status(400).json({ message: 'All fields and at least one option are required' });
    }

    const [exam] = await pool.query('SELECT * FROM exams WHERE id = ?', [exam_id]);
    if (exam.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const [existingQuestion] = await pool.query(
      'SELECT * FROM exam_questions WHERE exam_id = ? AND LOWER(question) = LOWER(?)',
      [exam_id, question]
    );
    if (existingQuestion.length > 0) {
      return res.status(400).json({ message: 'Question with this text already exists in this exam' });
    }

    const [result] = await pool.query(
      'INSERT INTO exam_questions (exam_id, question, type, noOfAnswer, incorrect_hint) VALUES (?, ?, ?, ?, ?)',
      [exam_id, question, type, noOfAnswer, incorrect_hint]
    );

    const questionId = result.insertId;

    const optionPromises = options.map(opt => {
      return pool.query(
        'INSERT INTO exam_options (question_id, option_text, isAnswer) VALUES (?, ?, ?)',
        [questionId, opt.option, opt.isAnswer]
      );
    });

    await Promise.all(optionPromises);

    res.status(201).json({ message: 'Exam question and options added successfully' });
  } catch (error) {
    console.error('Add Exam Question Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Get All Questions by Exam ID (exam_questions + exam_options)
const getExamQuestions = async (req, res) => {
  try {
    const { examId } = req.params;

    const [questions] = await pool.query('SELECT * FROM exam_questions WHERE exam_id = ?', [examId]);

    const questionWithOptions = await Promise.all(
      questions.map(async (q) => {
        const [options] = await pool.query(
          'SELECT id, option_text AS `option`, isAnswer FROM exam_options WHERE question_id = ?',
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
    console.error('Get Exam Questions Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Bulk Add Questions to Exam (exam_questions)
const bulkAddExamQuestions = async (req, res) => {
  try {
    const { examId } = req.params;
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Questions array is required' });
    }

    const [exam] = await pool.query('SELECT * FROM exams WHERE id = ?', [examId]);
    if (exam.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    for (const q of questions) {
      const { question, type, noOfAnswer, options, incorrect_hint = "" } = q;

      if (!question || !type || !noOfAnswer || !options || options.length === 0) {
        continue;
      }

      const [existingQuestion] = await pool.query(
        'SELECT * FROM exam_questions WHERE exam_id = ? AND LOWER(question) = LOWER(?)',
        [examId, question]
      );
      if (existingQuestion.length > 0) continue;

      const [result] = await pool.query(
        'INSERT INTO exam_questions (exam_id, question, type, noOfAnswer, incorrect_hint) VALUES (?, ?, ?, ?, ?)',
        [examId, question, type, noOfAnswer, incorrect_hint]
      );

      const questionId = result.insertId;

      const optionPromises = options.map(opt => {
        return pool.query(
          'INSERT INTO exam_options (question_id, option_text, isAnswer) VALUES (?, ?, ?)',
          [questionId, opt.option, opt.isAnswer]
        );
      });

      await Promise.all(optionPromises);
    }

    res.status(201).json({ message: 'Bulk exam questions inserted successfully (skipped duplicates).' });
  } catch (error) {
    console.error('Bulk Add Exam Questions Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = {
  addExamQuestion,
  getExamQuestions,
  bulkAddExamQuestions
};