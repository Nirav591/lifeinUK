const express = require('express');
const { addChapter, getChapters, updateChapter, deleteChapter } = require('../controllers/chapter.controller');
const { isAdmin } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// File upload config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Validation rules
const validateChapter = [
    body('name').notEmpty().withMessage('Name is required'),
];

// Add Chapter (admin only)
router.post(
    '/add',
    isAdmin,
    upload.single('icon'),
    validateChapter,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    addChapter
);

// Get all chapters
router.get('/all', getChapters);

// Update chapter
router.put(
    '/update/:id',
    isAdmin,
    upload.single('icon'),
    updateChapter
);

// Delete chapter
router.delete(
    '/delete/:id',
    isAdmin,
    deleteChapter
);

module.exports = router;