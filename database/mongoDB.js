const MongoClient = require("mongodb").MongoClient
require("dotenv").config();

let database;

const initDB = (callback) =>{
    if(database){
        return callback(null, database)
    }

    MongoClient.connect(process.env.MONGODB_URL)
    .then((client) =>{
        database = client
        console.log("Database successfully connected")
        callback(null, database)
    })
}

const getDB = ()=> {
    if(!database){
       console.log(`Database not connected error is ${error}`)
        
    }
    return database;

}

module.exports = {initDB, getDB}