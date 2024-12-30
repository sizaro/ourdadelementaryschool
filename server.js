const express = require("express");
const app = express();
require("dotenv").config();
const mongoDB = require("./database/mongoDB");
const bodyParser = require('body-parser');
const path = require('path');
const session = require("express-session");
const routes = require('./routes/index');  // Routes handled by your routes file
const cookieParser = require('cookie-parser');
const accountRoutes = require("./routes/accountRoutes");  // Account-related routes
const multer = require('./middleware/multermiddleware');  // Import multer for file uploads
const fs = require('fs');
const dasboardRoutes = require('./routes/dashboardRoutes')

// Initialize the upload directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('Uploads directory created.');
}

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use('/uploads', express.static('uploads'));  // Serve uploaded files statically

// Routes
app.use("/", routes);
app.use("/account/", accountRoutes);
app.use("/dashboard/", dasboardRoutes)

// Database initialization and server start
mongoDB.initDB((err) => {
    if (err) {
        console.log(`Error connecting: ${err}`);
    } else {
        app.listen(process.env.port, () => {
            console.log(`App is listening on port ${process.env.port}`);
        });
    }
});

module.exports = app;
