const express = require('express');
const { signup, login , getAllUsers} = require('../controllers/auth.controller');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/users', getAllUsers); // <-- New route


module.exports = router;