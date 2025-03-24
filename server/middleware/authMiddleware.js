const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  console.log('Token:', token);
  if (!token) return res.status(401).json({ error: 'Unauthorized access.' });

  try {
     
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   console.log('Decoded token:', decoded);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
