// Needed Resources
const express = require("express");
const router = new express.Router();
const accountCont = require("../controllers/accountController");
const regValidate = require("../utilities/validation");
const upload = require("../middleware/multermiddleware"); // Import multer middleware
const authenticateToken = require("../middleware/veryfymiddleware");
const AllStudentsDashboard = require("../controllers/dashboardstudents")

router.get("/students", AllStudentsDashboard.dashboardStudents)

//searching for all students and returning a json file.
router.get('/studentssearch/search', AllStudentsDashboard.getAllStudents)

//add new student.
router.get('/studentssearch/search', AllStudentsDashboard.getAllStudents)




module.exports = router