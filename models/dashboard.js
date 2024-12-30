const { addNewStudent } = require("../controllers/dashboardstudents");
const pool = require("../database/postgressDB");

async function AllStudents(query) {
  try {
    const sql = 'SELECT * FROM students WHERE name ILIKE $1 OR id = $2 ';
    const result = await pool.query(sql, [`%${query}%`, query]);

    // Check if any rows were returned and return the user details if found
    if (result.rows.length > 0) {
      return result.rows 
    } else {
      return [];  // Return null if no student is found
    }
  } catch (error) {
    console.error("Error checking students:", error.message);
    return { error: error.message };  // Return error message in case of failure
  }
}




async function registerNewStudent(student_first_name, student_middle_name, student_last_name, student_email, student_password, student_role, grade, parent_first_name, parent_middle_name, parent_last_name, parent_contact, parent_email, parent_relationship, parent_village, parent_city, parent_region) {
  const client = await pool;
  try {
    // Start transaction
    await client.query('BEGIN');

    // Insert into users table and get the generated user ID
    const userSql = `
      INSERT INTO users (email, password, role, created_at) 
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
      RETURNING user_id
    `;
    const userResult = await client.query(userSql, [student_email, student_password, student_role]);
    const userId = userResult.rows[0].user_id;

    // Insert into parents table and get the generated parent ID
    const parentSql = `
      INSERT INTO parents (first_name, middle_name, last_name, contact, email, relationship, village, city, region, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP) 
      RETURNING parent_id
    `;
    const parentResult = await client.query(parentSql, [parent_first_name, parent_middle_name, parent_last_name, parent_contact, parent_email, parent_relationship, parent_village, parent_city, parent_region]);
    const parentId = parentResult.rows[0].parent_id;

    // Insert into classes table for the selected grade (this will be used to assign class_id to the student)
    const classSql = `
      INSERT INTO classes (grade) 
      VALUES ($1) 
      RETURNING class_id
    `;
    const classResult = await client.query(classSql, [grade]);
    const classId = classResult.rows[0].class_id;

    // Insert into students table using the user ID, parent ID, and class ID
    const studentSql = `
      INSERT INTO students (user_id, parent_id, class_id, first_name, middle_name, last_name, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
    `;
    await client.query(studentSql, [userId, parentId, classId, student_first_name, student_middle_name, student_last_name]);

    // Commit the transaction
    await client.query('COMMIT');

    return { message: "Student registered successfully." };
  } catch (error) {
    // Rollback on error
    if (error) await client.query('ROLLBACK');
    console.error("Error during student registration:", error.message);
    return { error: error.message };
  }
}



module.exports = {AllStudents, addNewStudent}