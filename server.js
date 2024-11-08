const express = require("express")
const app = express()
require("dotenv").config()
const mongoDB = require("./database/mongoDB")
const bodyParser = require('body-parser');
const path = require('path');
const session = require("express-session");
const routes = require('./routes/index');
const cookieParser = require('cookie-parser');
const port = process.env.port
//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs")
app.use((req,res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
         'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');
    next();
})
// Session configuration
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

//routes

app.use("/",routes)


mongoDB.initDB((err)=>{
    if(err){
        console.log(`Error connecting is ${err}`)
    }
    else{
        app.listen(port, ()=>{console.log(`app is listening at port ${port}`)})
    }
})

module.exports = app



