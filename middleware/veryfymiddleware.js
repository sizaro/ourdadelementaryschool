// middleware/authMiddleware.js
/*

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("this is the tokenfile; ", authHeader)
  const token = authHeader.split(' ')[1];

  if (!token) return res.redirect('/login'); // No token, redirect to login

  jwt.verify(token, process.env.JSONWEB_SECRET, (err, user) => {
    if (err) return res.redirect('/login'); // Token invalid, redirect

    req.user = user; // Store the decoded token payload in req.user
    next(); // Call next middleware or route handler
  });
};*/

const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Retrieving token from cookies

  if (!token) {
    return res.redirect('account/login'); // No token found, redirect to login
  }

  // Verify the token
  jwt.verify(token, process.env.JSONWEB_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification error:", err);
      return res.redirect('/account/login'); // Invalid token, redirect to login
    }

    req.user = user; // Store the decoded token payload
    next(); // Proceed to next middleware or route handler
  });
};


