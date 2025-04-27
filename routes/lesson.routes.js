const express = require('express');
const { addLesson, getLessonsByChapter, updateLesson, deleteLesson } = require('../controllers/lesson.controller');
const { isAdmin } = require('../middleware/authMiddleware');
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

// Get Lessons by Chapter ID (public)
router.get('/byChapter/:chapterId', getLessonsByChapter);

// Update Lesson (admin only)
router.put('/update/:id', isAdmin, updateLesson);

// Delete Lesson (admin only)
router.delete('/delete/:id', isAdmin, deleteLesson);

module.exports = router;