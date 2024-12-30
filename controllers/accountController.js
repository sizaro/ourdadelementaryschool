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

/*const jwt = require('jsonwebtoken');
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
*/
/*
async function registerAccount(req, res) {
  //const loginForm = await utilities.buildLoginForm();
  //const RegisterForm = await utilities.buildRegisterForm();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);

    const regResult = await acctModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword 
    );

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      res.status(201).render("account/login", {
        errors: null
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        errors: null
      });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    req.flash("notice", "An error occurred during registration.");
    res.status(500).render("account/register", {
      errors: error.message,
    });
  }
}

module.exports = {registerAccount, }*/


const bcrypt = require('bcrypt');
const acctModel = require("../models/account-model");
const jwt = require('jsonwebtoken');
const { query } = require('../database/postgressDB');
const CheckEmail = require("../models/account-model");
require("dotenv").config();

async function verifyUser(req, res) {
  const { email, password } = req.body;

  try {
    // Query to check if user exists in the database
    const result = await CheckEmail.FindEmail(email);
    console.log("this is the user in the database", result)

    const databasePwd = result.password;

    // Use bcrypt.compare to compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, databasePwd);

    if (!isMatch) {
      return res.status(401).send("Incorrect password");
    }

    // Create a token if credentials are valid
    const token = jwt.sign(
      { id: result.user_id, email: result.email },
      process.env.JSONWEB_SECRET,
      { expiresIn: "30m" } // Set token expiration
    );

    // Set token as a cookie if necessary
    res.cookie('token', token, { httpOnly: true });
    res.redirect("/account/director");

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

async function logoutUser(req, res) {
    res.clearCookie('token'); // Clear JWT cookie
    res.redirect('/account/login');
  };

async function directorDashboard(req, res) {
    res.render('dr-dashboard');
  };


async function registerAccount(req, res) {
  const { first_name, middle_name, last_name, email, password, role } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null; // Get the image path

  try {
    console.log("User details received:", first_name, middle_name, last_name, email, role, image_url);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Call the model to save the user
    const regResult = await acctModel.registerAccount(
      first_name,
      middle_name,
      last_name,
      email,
      hashedPassword,
      role,
      image_url
    );

    if (regResult) {
      return res.status(201).render("signup", {
        title: "Register",
        message: `Congratulations, you're registered ${first_name}. Please log in.`,
        errors: null,
      });
    }

    res.status(501).render("signup", {
      title: "Register",
      message: "Sorry, the registration failed. Please try again.",
      errors: null,
    });

  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).render("signup", {
      title: "Register",
      message: "An error occurred during registration.",
      error: error.message,
    });
  }
}

/* ****************************************
*  Render Register View
* **************************************** */
function buildRegisterView(req, res) {
  res.render("signup", {
    title: "Register",
    errors: null,
    message: "Welcome Director Michael, Please create your account",
  });
}
module.exports = { 
  verifyUser,
  logoutUser,
  directorDashboard,
  registerAccount,
  buildRegisterView,
};
