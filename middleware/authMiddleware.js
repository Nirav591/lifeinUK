const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, "key");
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, Admins only' });
    }

    req.user = decoded; // Attach decoded user info
    next();
  } catch (error) {
    console.error('isAdmin Middleware Error:', error);
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = { isAdmin };