const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../database/postgressDB');
const CheckEmail = require("../models/account-model");
require("dotenv").config();
const dashboardModel = require("../models/dashboard");
const studentObj = {}


async function dashboardStudents (req, res) {
    res.render('students/students');
  };


//fetches all students

// async function getAllStudents (req, res) {
//   const query = req.query.query;
//   try {
//       // Replace with your database query
//       const students = await dashboardModel.AllStudents(query)
//       if (students) {
//           res.json(students);
//       } else {
//           res.json({});
//       }
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Error fetching student data." });
//   }
// }


async function getAllStudents(req, res) {
    const query = req.query.query;
    try {
      // Mock data for testing
      const testStudents = [
        {
          id: 1,
          name: "John Doe",
          email: "johndoe@example.com",
          class: "Math 101",
          parent_name: "Jane Doe",
          contact: "1234567890",
        },
        {
          id: 2,
          name: "Mary Jane",
          email: "maryjane@example.com",
          class: "Science 202",
          parent_name: "Peter Parker",
          contact: "0987654321",
        },
        {
          id: 3,
          name: "Alice Smith",
          email: "alicesmith@example.com",
          class: "History 303",
          parent_name: "Bob Smith",
          contact: "1112233445",
        }
      ];
  
      // Filter students based on the search query (if provided)
      if (query) {
        const filteredStudents = testStudents.filter(student =>
          student.name.toLowerCase().includes(query.toLowerCase())
        );
        return res.json(filteredStudents);
      }
  
      // If no query, return all students
      res.json(testStudents);
    } catch (error) {
      console.error("Error: ", error.message);
      res.status(500).json({ message: "Error fetching student data." });
    }
  }
  

//adding new student. student registration 

async function addNewStudent(req, res) {
  const {
    student_first_name,
    student_middle_name,
    student_last_name,
    student_email,
    student_dob,
    student_gender,
    student_role,
    parent_first_name,
    parent_middle_name,
    parent_last_name,
    parent_email,
    parent_contact,
    parent_relationship,
    parent_village,
    parent_city,
    parent_region,
    parent_other_details,
  } = req.body;

  const student_image = req.files?.student_image
    ? `/uploads/${req.files.student_image[0].filename}`
    : null;
  const parent_image = req.files?.parent_image
    ? `/uploads/${req.files.parent_image[0].filename}`
    : null;

  try {
    // Check if the student email already exists
    const emailExists = await dashboardModel.checkExistingEmail(student_email);
    if (emailExists) {
      return res.status(400).render("signup", {
        title: "Register",
        message: `The email ${student_email} is already registered.`,
        errors: null,
      });
    }

    console.log(
      "Details received for registration:",
      student_first_name,
      student_middle_name,
      student_last_name,
      student_email,
      student_password,
      student_dob,
      student_gender,
      student_role,
      student_image,
      parent_first_name,
      parent_middle_name,
      parent_last_name,
      parent_email,
      parent_contact,
      parent_relationship,
      parent_image,
      parent_village,
      parent_city,
      parent_region,
      parent_other_details
    );

    // Generate and hash a password
    const hashedPassword = await bcrypt.hash(student_passwordord, 10);

    // Call the model with all details, including the hashed password
    const regResult = await dashboardModel.addNewStudent(
      student_first_name,
      student_middle_name,
      student_last_name,
      student_email,
      hashedPassword, // Pass hashed password
      student_dob,
      student_gender,
      student_role,
      student_image,
      parent_first_name,
      parent_middle_name,
      parent_last_name,
      parent_email,
      parent_contact,
      parent_relationship,
      parent_image,
      parent_village,
      parent_city,
      parent_region,
      parent_other_details
    );

    if (regResult) {
      // Notify the user of successful registration
      return res.status(201).render("signup", {
        title: "Register",
        message: `Registration successful for ${student_first_name}. Your temporary password is ${password}. Please log in and change it immediately.`,
        errors: null,
      });
    }

    res.status(501).render("signup", {
      title: "Register",
      message: "Registration failed. Please try again.",
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

  



module.exports = {dashboardStudents, getAllStudents, addNewStudent}