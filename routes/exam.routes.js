const express = require('express');
const { addExam, getAllExams, getExamById, updateExam, deleteExam } = require('../controllers/exam.controller');
const { isAdmin } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation
const validateExam = [
  body('title').notEmpty().withMessage('Title is required'),
  body('duration').notEmpty().withMessage('Duration is required'),
];

// Add Exam (admin only)
router.post(
  '/add',
  isAdmin,
  validateExam,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  addExam
);

// Get all exams (public)
router.get('/all', getAllExams);

// Get single exam (public)
router.get('/:id', getExamById);

// Update exam (admin only)
router.put('/update/:id', isAdmin, updateExam);

// Delete exam (admin only)
router.delete('/delete/:id', isAdmin, deleteExam);

module.exports = router;