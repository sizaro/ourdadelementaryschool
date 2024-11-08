const {Pool} = require("pg")
require("dotenv").config()

async function testconnection() {
    try {
        const results = await pool.query('SELECT NOW()')
        console.log(`Database connected ${results.rows[0]}`)
    } catch (error) {
        console.log(error)
    }
}

let pool    

if(process.env.NODE_ENV =="development"){

    pool = new Pool({
        connectionString:process.env.DATABASE_URL,
        ssl:{
            rejectUnauthorized:false,
        }
    })
    testconnection()
    async function query(text, params) {
        const results = await pool.query(text, params)
        console.log(results.rows, `executed query: ${text}`)
        return results
        
    }

    module.exports = {query}
} else{
    pool = new Pool({
        connectionString:process.env.DATABASE_URL
    })
    testconnection()
    module.exports = pool
}