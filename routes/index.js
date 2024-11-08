// routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers');
const accountCont = require("../controllers/accountController")
const middleWare = require("../middleware/veryfymiddleware")

// Route to display the homepage
router.get('/', userController.getHomePage);

// Route for sign-in
router.get('/login', userController.getSignInPage);


// Route for adding a new student
router.post('/add-student', userController.addStudent);

router.post('/account/user1', accountCont.verifyUser);


// Protected route for the director's dashboard
router.get('/director', middleWare.authenticateToken, accountCont.directorDashboard)

// Route for logout
router.get('/logout', accountCont.logoutUser)

// Export the router
module.exports = router;
