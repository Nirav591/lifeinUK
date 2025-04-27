const express = require('express');
const { addLesson } = require('../controllers/lesson.controller');
const { isAdmin } = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation rules
const validateLesson = [
  body('chapter_id').notEmpty().withMessage('Chapter ID is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('htmlContent').notEmpty().withMessage('HTML Content is required'),
];

// Add Lesson (admin only)
router.post(
  '/add',
  isAdmin,
  validateLesson,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  addLesson
);

module.exports = router;