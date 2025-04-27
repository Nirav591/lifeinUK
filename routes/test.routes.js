const express = require('express');
const { addTest, getAllTests, getTestById, updateTest, deleteTest } = require('../controllers/test.controller');
const { isAdmin } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation rules
const validateTest = [
  body('title').notEmpty().withMessage('Title is required'),
];

// Add Test (admin only)
router.post(
  '/add',
  isAdmin,
  validateTest,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  addTest
);

// Get all tests (public)
router.get('/all', getAllTests);

// Get single test (public)
router.get('/:id', getTestById);

// Update test (admin only)
router.put('/update/:id', isAdmin, updateTest);

// Delete test (admin only)
router.delete('/delete/:id', isAdmin, deleteTest);

module.exports = router;