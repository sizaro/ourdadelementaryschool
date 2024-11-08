const bcrypt = require("bcrypt")

const password = "michael123"

const saltRounds = 10

bcrypt.hash(password, saltRounds, (err, hash) =>{
    if(err){
        console.log(err)
    }else{
        console.log("hashed password:", hash)
    }
})