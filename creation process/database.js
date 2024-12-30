// CREATE TABLE users (
//     user_id SERIAL PRIMARY KEY, -- Auto-incremented user ID
//     email VARCHAR(255) UNIQUE NOT NULL, -- Unique email for each user
//     password VARCHAR(255) NOT NULL, -- Encrypted password
//     role VARCHAR(50) NOT NULL, -- Role of the user (e.g., director, teacher, student)
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of account creation
// );


// CREATE TABLE director (
//     director_id SERIAL PRIMARY KEY, -- Auto-incremented director ID
//     user_id INTEGER NOT NULL, -- Foreign key referencing the users table
//     first_name VARCHAR(100) NOT NULL, -- Director's first name
//     last_name VARCHAR(100) NOT NULL, -- Director's last name
//     middle_name VARCHAR(100), -- Optional middle name
//     image_url VARCHAR(255), -- URL to the director's profile image
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of director record creation
//     FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE -- Cascade delete when user is removed
// );





// -- Create the 'students' table
// CREATE TABLE students (
//     student_id SERIAL PRIMARY KEY, -- Unique student ID
//     user_id INT NOT NULL, -- References the user ID
//     first_name VARCHAR(50) NOT NULL,
//     middle_name VARCHAR(50),
//     last_name VARCHAR(50) NOT NULL,
//     email VARCHAR(100) NOT NULL UNIQUE,
//     dob DATE NOT NULL, -- Date of Birth
//     gender VARCHAR(10) NOT NULL, -- e.g., 'Male', 'Female', 'Other'
//     image_path VARCHAR(255), -- Path to student's image
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the record is created
//     FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
// );