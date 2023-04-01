var  express = require("express"),
app = express()

const mongoose = require("mongoose"),


expressvalidator = require("express-validator"),

session = require("express-session"),

methodOverride = require("method-override"),

bodyparser = require("body-parser"),

passport = require("passport"),

LocalStrategy = require("passport-local").Strategy

passportLocalMongoose =  require("passport-local-mongoose"),

flash = require("connect-flash"),

employee  = require("./models/employee");

hr = require("./models/hr"),


Leave = require("./models/leave");

// var moment = require("moment");
require("dotenv").config();
 const port = process.env.PORT

const connectDB = require('./config/hrDb')

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/leaveApp"

connectDB(MONGO_URI)




























app.get("/hr/login",(req,res)=>{
    res.render("hrlogin");
});

app.post(
    "/hr/login",
    passport.authenticate("hr",{
        successRedirect:"/hr/home",
        failureRedirect:"/hr/login",
        failureFlash:true
    }),
   
)








//logout for employee

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
})

// const port = process.env.port || 3005;
app.listen(port, ()=>{
    console.log(`Server started at port ${port}`);
});