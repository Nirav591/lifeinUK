const express = require('express');
const router = express.Router();
const {
  addExamQuestion,
  getExamQuestions,
  bulkAddExamQuestions
} = require('../controllers/examQuestionController');

router.post('/', addExamQuestion);
router.get('/:examId', getExamQuestions);
router.post('/bulk/:examId', bulkAddExamQuestions);

module.exports = router;