const express = require('express');
const router = express.Router();
const {
  addExamQuestion,
  getExamQuestions,
  bulkAddExamQuestions
} = require('../controllers/examQuestionController');

// Single question
router.post('/', addExamQuestion);

// Get questions by exam ID
router.get('/:examId', getExamQuestions);

// Bulk insert
router.post('/bulk/:examId', bulkAddExamQuestions);

module.exports = router;