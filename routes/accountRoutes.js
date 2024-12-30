// // Needed Resources
// const utilities = require("../utilities/validation")
// const regValidate = require('../utilities/validation')
// const express = require("express")
// const router = new express.Router()
// const accountCont = require("../controllers/accountController")

// //Route to get the login page
// //router.get("/login", utilities.handleErrors(accountCont.buildLoginView))

// //Route to get the login page
// //router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountCont.accountLogin))

// // Protected route example
// /*router.get('/profile', authUser.ensureAuthenticated, accountCont.displayProfile);*/

// //Route to get the register page
// router.get("/signup", accountCont.buildRegisterView)

// //Route to get the access to dashboard
// router.post('/register', regValidate.registrationRules(), regValidate.checkRegData, accountCont.registerAccount)//utilities.handleErrors())

// //router.get("/", utilities.checkLogin, accountCont.buildLoggedinView)

// module.exports = router




// Needed Resources
const express = require("express");
const router = new express.Router();
const accountCont = require("../controllers/accountController");
const regValidate = require("../utilities/validation");
const upload = require("../middleware/multermiddleware"); // Import multer middleware
const authenticateToken = require("../middleware/veryfymiddleware");

// Route to get the register page
router.get("/signup", accountCont.buildRegisterView);

// Route to get the user's page
router.post("/user", accountCont.verifyUser);

// Route to get the user's page
router.get("/director", authenticateToken.authenticateToken, accountCont.directorDashboard );

// Route to handle user registration with image upload
router.post(
  "/register",
  upload.single("image_url"), // Multer middleware to handle the image upload
  regValidate.registrationRules(), // Validation rules for registration
  regValidate.checkRegData,        // Validation check middleware
  accountCont.registerAccount      // Controller to handle registration
);

module.exports = router;

