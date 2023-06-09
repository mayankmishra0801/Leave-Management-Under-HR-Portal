var mongoose = require("mongoose")
var bcrypt = require("bcryptjs")

var passportLocalMongoose = require("passport-local-mongoose")


var hrSchema = new mongoose.Schema({

  name: String,
  type:String,
  username:String,
  password:String,

  leaves:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Leave"
    }
  ]
});

hrSchema.plugin(passportLocalMongoose);

var HR = (module.exports = mongoose.model("Hr",hrSchema));

module.exports.createHr = function(newHr, callback){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newHr.password,salt,function(err,hash){
            newHr.password = hash;
            newHr.save(callback);
        })
    })
};
module.exports.getUserByUsername = function(username,callback){
  var query = {username:username};
  HR.findOne(query,callback);

}

module.exports.getUserById = function(id,callback){
    HR.findById(id,callback);
};

module.exports.comparePassword = function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword,hash,function(err,passwordFound){
        if(err) throw err;
        callback(null, passwordFound);
    })
}