const pool = require("../database/postgressDB");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(first_name, middle_name, last_name, email, password, role, image_url) {
  console.log("this is the role inside the query", first_name, middle_name, last_name, email, password, image_url, role)
  const client = await pool;
  try {
    // Connect to the pool

    // Start transaction
    await client.query('BEGIN');
    
    // Insert into users table and get the generated user ID
    const userSql = `
      INSERT INTO users (email, password, role, created_at) 
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
      RETURNING user_id
    `;
    console.log("SQL Query Parameters:", email, password, role);
    const userResult = await client.query(userSql, [email, password, role]);
    const userId = userResult.rows[0].user_id;

    // Insert into the director table using the user ID
    const directorSql = `
      INSERT INTO director (user_id, first_name, last_name, middle_name, image_url, created_at) 
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
    `;
    console.log("SQL Query directors userid:", userId);
    await client.query(directorSql, [userId, first_name, last_name, middle_name, image_url]);

    // Commit the transaction
    await client.query('COMMIT');

    return { message: "Account registered successfully." };
  } catch (error) {
    // Rollback on error
    if (error) await client.query('ROLLBACK');
    console.error("Error during registration:", error.message);
    return { error: error.message }
}
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(email) {
  try {
    const sql = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(sql, [email]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error checking email:", error.message);
    return { error: error.message };
  }
}


async function FindEmail(email) {
  try {
    const sql = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(sql, [email]);

    // Check if any rows were returned and return the user details if found
    if (result.rows.length > 0) {
      return result.rows[0];  // Return the first user found (since emails should be unique)
    } else {
      return null;  // Return null if no user found
    }
  } catch (error) {
    console.error("Error checking email:", error.message);
    return { error: error.message };  // Return error message in case of failure
  }
}



module.exports = { registerAccount, checkExistingEmail, FindEmail};
