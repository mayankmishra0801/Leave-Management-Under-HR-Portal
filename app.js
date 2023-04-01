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

app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(expressvalidator());


//passport config

app.use(
    require("express-session")({
        secret:"secret",
        resave:false,
        saveUninitialized:false
    })
);

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());
app.use((req,res,next)=>{

    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.user = req.user || null;

    next();

});

function ensureAuthentication(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error","You need to be logged in");
        res.redirect("/student/login");
    }
}

app.get("/",(req,res)=>{
    res.render("home");
});

//registration form

app.get("/register",(req,res)=>{
    res.render("register")
});

//registration logic
app.post("/employee/register",(req,res)=>{
    var type = req.body.type;
    if(type == "employee"){
        var name = req.body.name;
        var username = req.body.username;
        var password = req.body.password;
        var password2 = req.body.password2;
    }

    //validation
    req.checkBody("name","name is required").notEmpty();
    req.checkBody("username","Username is required").notEmpty();
    req.checkBody("password","Password is required").notEmpty();
    req.checkBody("password2","Password don't match").equals(req.body.password);

    var errors = req.validationsErrors();
    
    
    
    
    
    if(errors){
        console.log("errors: "+ errors);
        res.render("register",{
            errors:errors
        });

    }else{
        var newEmployee = new Employee({
            name: name,
            username:username,
            password:password,
            type:type,

        });
        Employee.createEmployee(newEmployee,(err,employee)=>{
            if(err) throw err;
            console.log(employee);
        });
        req.flash("success","ypu are registered successfully, now you can login")

        res.redirect("/employee/login");

    } 

}





);

//serialize

passport.serializeUser(function(user,done){
    //console.log(user.id);

    done(null,{id:user.id,type:user.type});
})

//deserialize

passport.deserializeUser(function(obj,done){
  
    switch(obj.type){
        case "employee":
            Employee.getUserById(obj.id,function(err,employee){
                done(err,employee)
            });
            break;
            case "hr":
            Hr.getUserById(obj.id,function(err,hr){
                done(err,hr)
            });
            break;
            default:
                done(new Error("no entity tye:", obj.type),null);

            
    }




});

// app.get("/Employee/login",(req.res)=>{

// res.render("login");


// });

app.post("/employee/login",

passport.authenticate("employee",{
    successRedirect : "/employee/home",
    failureRedirect:"/employee/login",
    failureFlash:true
}),

(req,res)=>{
   res.redirect("/employee/home"); 
}
);

app.get("/employee/home",ensureAuthenticated,(req,res)=>{
    
    var employee = req.user.employee;
    console.log(employee);
    Employee.findOne({username:req.user.username})
    .populate("leaves")
    .exec((err,employee)=>{
        if(err || !employee){
            req.flash("error","Employee do not found");
             res.redirect("back");
             console.log("err");
          
        }else{
            res.render("homeemp",{
                employee:employee,
                moment: moment
            });

        }
    });
});

app.get("employee/:id",ensureAuthenticated,(req,res)=>{
  
    console.log(req.params.id);
    Employee.findById(req.params.id)
    .populate("leaves")
    .exec((err,foundEmployee)=>{
        if(err || !foundEmployee){
            req.flash("error","Employee not found");
            res.redirect("back");

        }else{
            res.render("profileemp",{employee: foundEmployee});
        }
});

});
app.get("/employee.:id/edit",ensureAuthenticated,(req,res)=>{

Employee.findById(req.params.id,(err,foundEmployee)=>{
   res.render("editE",{
    employee:foundEmployee
   }) ;
});

});

app.put("/employee/:id",ensureAuthenticated,(req,res)=>{
 
    console.log(req.body.employee);
    Employee.findByIdAndUpdate(
        req.params.id,
        req.body.employee,
        (err, updatedEmployee)=>{
            if(err){
                req.flash("error",err.message);
                res.redirect("back");
            }else{
                req.flash("success","Successfully updated");
                res.redirect("/employee/"+req.params.id);
            }
        }
    );

});

app.get("/student/:id/apply",ensureAuthenticated,(req,res)=>{
    Employee.findById(req.params.id,(err,foundEmpl) =>{
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("leaveAplly",{employee:foundEmpl});

        }
    });
});

app.post("/employee/:id/apply", (req, res) => {
    Employee.findById(req.params.id)
      .populate("leaves")
      .exec((err, student) => {
        if (err) {
          res.redirect("/employee/home");
        } else {
          date = new Date(req.body.leave.from);
          todate = new Date(req.body.leave.to);
          year = date.getFullYear();
          month = date.getMonth() + 1;
          dt = date.getDate();
          todt = todate.getDate();
  
          if (dt < 10) {
            dt = "0" + dt;
          }
          if (month < 10) {
            month = "0" + month;
          }
          console.log(todt - dt);
          req.body.leave.days = todt - dt;
          console.log(year + "-" + month + "-" + dt);
          // req.body.leave.to = req.body.leave.to.substring(0, 10);
          console.log(req.body.leave);
          // var from = new Date(req.body.leave.from);
          // from.toISOString().substring(0, 10);
          // console.log("from date:", strDate);
          Leave.create(req.body.leave, (err, newLeave) => {
            if (err) {
              req.flash("error", "Something went wrong");
              res.redirect("back");
              console.log(err);
            } else {
              newLeave.emp.id = req.user._id;
              newLeave.emp.username = req.user.username;
              console.log("leave is applied by--" + req.user.username);
  
              // console.log(newLeave.from);
              newLeave.save();
  
              employee.leaves.push(newLeave);
  
              employee.save();
              req.flash("success", "Successfully applied for leave");
              res.render("homeemp", { employee: employee, moment: moment });
            }
          });
        }
      });
  });

















// app.post("/employee/:id/apply",(req,res)=>{
  
//     Employee.findById(req.params.id)
//     .populate("leaves")
//     .exec((err,employee)=>{
//         if(err){
//             res.redirect("/employee/home");
//         }else{
//             date = new Date(req.body.leave.from);
//             todate = new Date(req.body.leave.to);
//             year = date.getFullYear();
//             month = date.getMonth() +1;
//             dt = date.getDate();
//             todt = todate.getDate();
//             if (dt < 10) {
//                 dt = "0" + dt;
//               }
//               if (month < 10) {
//                 month = "0" + month;
//               }
//               console.log(todt - dt);
//               req.body.leave.days = todt - dt;
//               console.log(year + "-" + month + "-" + dt); 
//                   console.log(req.body.leave);
               
//                   Leave.create(req.body.leave, (err, newLeave) => {
//                     if (err) {
//                       req.flash("error", "Something went wrong");
//                       res.redirect("back");
//                       console.log(err);
//                     } else {
//                       newLeave.emp.id = req.user._id;
//                       newLeave.emp.username = req.user.username;
//                       console.log("leave is applied by--" + req.user.username);
                      
//                       newLeave.save();

//                       employee.leaves.push(newLeave);
          
//                       employee.save();
//                       req.flash("success", "Successfully applied for leave");
//                       res.render("homeemp", { employee: employee, moment: moment });
//         }


//     });







app.get("employee/:id/track",(req,res)=>{
 
    Employee.findById(req.params.id)
    .populate("leaves")
    .exec((err,foundStud)=>{
        if(err){
            req.flash("error","No Employee with requested id");
            res.redirect("back");
        }else{
            res.render("trackLeave", {employee:foundEmp,moment:moment});
        }
    });



});



app.get("/hr/login", (req, res) => {
    res.render("hrlogin");
  });
  
  app.post(
    "/hr/login",
    passport.authenticate("hr", {
      successRedirect: "/hr/home",
      failureRedirect: "/hr/login",
      failureFlash: true
    }),
    (req, res) => {
      res.redirect("/hr/home");
    }
  );
  app.get("/hr/home", ensureAuthenticated, (req, res) => {
    Hod.find({}, (err, hod) => {
      if (err) {
        console.log("err");
      } else {
        res.render("homehr", {
          hod: req.user
        });
      }
    });
  });
  app.get("/hr/:id", ensureAuthenticated, (req, res) => {
    console.log(req.params.id);
    Hod.findById(req.params.id).exec((err, foundHr) => {
      if (err || !foundHr) {
        req.flash("error", "Hr not found");
        res.redirect("back");
      } else {
        res.render("profilehr", { hod: foundHr });
      }
    });
  });
  app.get("/hr/:id/edit", ensureAuthenticated, (req, res) => {
    Hod.findById(req.params.id, (err, foundHr) => {
      res.render("editH", { hr: foundHr});
    });
  });
  app.put("/hr/:id", ensureAuthenticated, (req, res) => {
    console.log(req.body.hr);
    Hod.findByIdAndUpdate(req.params.id, req.body.hod, (err, updatedHr) => {
      if (err) {
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        req.flash("success", "Succesfully updated");
        res.redirect("/hr/" + req.params.id);
      }
    });
  });
  app.get("/hr/:id/leave", (req, res) => {
    Hod.findById(req.params.id).exec((err, hrFound) => {
      if (err) {
        req.flash("error", "hr not found with requested id");
        res.redirect("back");
      } else {
        // console.log(hrFound);
        Employee.find({ department: hrFound.department })
          .populate("leaves")
          .exec((err, employee) => {
            if (err) {
              req.flash("error", "employee not found with your department");
              res.redirect("back");
            } else {
              
              res.render("hrLeaveSign", {
                hr: hrFound,
                employee: employee,
                // leave: leaveFound,
                moment: moment
              });
            
            }
          });
      }
      // console.log(req.body.hr);
    });
  });
  
  app.get("/hr/:id/leave/:emp_id/info", (req, res) => {
    Hr.findById(req.params.id).exec((err, hrFound) => {
      if (err) {
        req.flash("error", "hr not found with requested id");
        res.redirect("back");
      } else {
        employee.findById(req.params.emp_id)
          .populate("leaves")
          .exec((err, foundEmployee) => {
            if (err) {
              req.flash("error", "employee not found with this id");
              res.redirect("back");
            } else {
              res.render("moreinfoemp", {
                employee: foundEmployee,
                hr: hrFound,
                moment: moment
              });
            }
          });
      }
    });
  });
  
  app.post("/hr/:id/leave/:emp_id/info", (req, res) => {
    Hr.findById(req.params.id).exec((err, hrFound) => {
      if (err) {
        req.flash("error", "hr not found with requested id");
        res.redirect("back");
      } else {
        Employee.findById(req.params.stud_id)
          .populate("leaves")
          .exec((err, foundEmployee) => {
            if (err) {
              req.flash("error", "employee not found with this id");
              res.redirect("back");
            } else {
              if (req.body.action === "Approve") {
                foundEmployee.leaves.forEach(function(leave) {
                  if (leave.status === "pending") {
                    leave.status = "approved";
                    leave.approved = true;
                    leave.save();
                  }
                });
              } else {
                console.log("u denied");
                foundEmployee.leaves.forEach(function(leave) {
                  if (leave.status === "pending") {
                    leave.status = "denied";
                    leave.denied = true;
                    leave.save();
                  }
                });
              }
              res.render("moreinfoemp", {
                employee: foundEmployee,
                hr: hrFound,
                moment: moment
              });
            }
          });
      }
    });
  });





//logout for employee

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
})

// const port = process.env.port || 3005;
app.listen(port, ()=>{
    console.log(`Server started at port ${port}`);
});