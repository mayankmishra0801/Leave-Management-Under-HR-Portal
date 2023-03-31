var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var passportLocalMongoose = require("passport-local-mongoose");
var employeeSchema = new Mongoose.Schema({

  name:String,
  type:String,
  username:String,
  password:String,
  leaves:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Leave"
    }
  ]


});

EmployeeSchema.plugin(passportLocalMongoose);
var Employee = (module.exports = mongoose,model("Employee",employeeSchema))

module.exports.createEmployee = function(newEmployee, callback){
    bcrypt.genSalt(10, function(err,salt){
        bcrypt.hash(newEmployee.password,salt,function(err,hash){
            newEmployee.password = hash;
            newEmployee.save(callback);
        });
    });
};

module.exports.getUserByUserName =  function(username, callback){
    var query = {username:username};
    Employee.findOne(query,callback);
};

module.exports.getUserById = function(id, callback){
    Student.findById(id,callback);
};

module.exports.comparePassword = function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword,hash,function(err,passwordFound){
      
        if(err) throw err;

        callback(null,passwordFound)


    });
}
