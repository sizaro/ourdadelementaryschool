/*const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../database/postgressDB');
require("dotenv").config()

exports.verifyUser = async (req, res,) => {
  const { dir_email, dir_password } = req.body;
  const user ={useremail:dir_email}

  try {
    // Query to check if user exists in the database
    const result = await query('SELECT * FROM director WHERE dir_email = $1', [dir_email]);

    // Assuming the password is hashed, compare it
    const databasePwd = result.rows[0].dir_password;
    const isMatch = databasePwd === dir_password? console.log("paswword is correct"):console.log("paswword is incorect");

    // Create a token if credentials are valid
    const token = jwt.sign(
      { id: result.rows[0].dir_id, email: result.rows[0].dir_email },
      process.env.JSONWEB_SECRET,
      { expiresIn: "30m" } // Set token expiration
    );

     // Set token as a cookie if necessary
     res.cookie('token', token, { httpOnly: true });
     res.redirect("/director");

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};



exports.logoutUser = (req, res) => {
    res.clearCookie('token'); // Clear JWT cookie
    res.redirect('/login');
  };

exports.directorDashboard = (req, res) => {
    res.render('dr-dashboard');
  };*/

const jwt = require('jsonwebtoken');
const { query } = require('../database/postgressDB');
require("dotenv").config();

exports.verifyUser = async (req, res) => {
  const { dir_email, dir_password } = req.body;

  try {
    // Query to check if the user exists in the database
    const result = await query('SELECT * FROM director WHERE dir_email = $1', [dir_email]);

    if (result.rows.length === 0) {
      return res.status(400).send("User not found");
    }

    const databasePwd = result.rows[0].dir_password;

    // Directly compare plain text passwords for testing purposes
    if (dir_password !== databasePwd) {
      return res.status(401).send("Incorrect password");
    }

    // Generate JWT token after password validation
    const token = jwt.sign(
      { id: result.rows[0].dir_id, email: result.rows[0].dir_email },
      process.env.JSONWEB_SECRET,
      { expiresIn: "30m" } // Set token expiration
    );

    // Set the token as a cookie or send it in response
    res.cookie('token', token, { httpOnly: true });
    res.redirect("/director");

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};


exports.directorDashboard = (req, res) => {
  res.render('dr-dashboard');
}  


exports.logoutUser = (req, res) => {
  res.clearCookie('token'); 
  res.redirect("/");
};

