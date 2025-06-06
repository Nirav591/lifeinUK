const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup Error:', error); // <-- Show real error
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [userResult] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = userResult[0];
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            "mysecretkey",
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login Error:', error); // <-- Show real error
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
      const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users');
      res.status(200).json(users);
    } catch (error) {
      console.error('Get All Users Error:', error);
      res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  };

module.exports = { signup, login, getAllUsers };