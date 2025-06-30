// middlewares/accessKey.js
module.exports = (req, res, next) => {
  const clientKey = req.headers['x-access-key'];

  if (!clientKey || clientKey !== 'solid-black') {
    return res.status(403).json({ message: 'Forbidden: Invalid access key' });
  }
  next();
};