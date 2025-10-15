const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/error')

 const verifyToken = (req, res, next) => {

  // Check for token in Authorization header first, then cookies
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) // Remove 'Bearer ' prefix
    : req.cookies.access_token;

  if (!token) return next(errorHandler(401, 'Unauthorized'));

  jwt.verify(token, process.env.JWT_SECRET || "5345jkj5kl34j5kl34j5", (err, user) => {
    if (err) return next(errorHandler(403, 'Forbidden'));

    req.user = user;
    next();
  });
};

module.exports = verifyToken;
