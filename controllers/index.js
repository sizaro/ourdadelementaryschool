// userController.js
const users = []; // This will hold user data temporarily

// Function to display the homepage
exports.getHomePage = (req, res) => {
    res.render("home.ejs");
};

// Function for student, teacher, or director sign-in
exports.getSignInPage = (req, res) => {
    res.render("login");
};

// Function to add a new student
exports.addStudent = (req, res) => {
    const { firstname, secondname, birthdate, email, address } = req.body;
    const newUser = {
        firstname,
        secondname,
        birthdate,
        email,
        address,
        registrationDate: new Date(),
    };
    users.push(newUser); // Replace with DB insert in real application
    res.send('Student added successfully!');
};
