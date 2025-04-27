const express = require('express');
const { addQuestion, getQuestionsByTest, updateQuestion, deleteQuestion , bulkAddQuestions} = require('../controllers/question.controller');
const { isAdmin } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation rules
const validateQuestion = [
  body('test_id').notEmpty().withMessage('Test ID is required'),
  body('question').notEmpty().withMessage('Question is required'),
  body('type').notEmpty().withMessage('Type (SINGLE or MULTIPLE) is required'),
  body('noOfAnswer').notEmpty().withMessage('Number of answers is required'),
  body('options').isArray({ min: 1 }).withMessage('At least one option is required')
];

// Add Question (admin only)
router.post(
  '/add',
  isAdmin,
  validateQuestion,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  addQuestion
);

// Get Questions by Test ID (public)
router.get('/byTest/:testId', getQuestionsByTest);

// Update Question (admin only)
router.put('/update/:id', isAdmin, updateQuestion);

// Delete Question (admin only)
router.delete('/delete/:id', isAdmin, deleteQuestion);

router.post('/bulkAdd', isAdmin, bulkAddQuestions);

module.exports = router;