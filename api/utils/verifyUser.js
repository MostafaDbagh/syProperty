const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/error')

 const verifyToken = (req, res, next) => {

  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, 'Unauthorized'));

  jwt.verify(token, "5345jkj5kl34j5kl34j5", (err, user) => {
    if (err) return next(errorHandler(403, 'Forbidden'));

    req.user = user;
    next();
  });
};

module.exports = verifyToken;
