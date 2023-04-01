const  mongoose = require("mongoose");
var Schema=mongoose.Schema

var leaveSchema = new Schema(
    {

        month:{
            january:{
              leaves:{
               from:{
                   type: Date,
                    required: true
               },
               to:{
                   type: Date,
                   required: true
               },
               reason: {
                type: String,
                required: true
              },
              action:{
                type:String,
                enum:["pending","approved","denied"],
                default:"pending"
            },
            
           

              }
            }
       },
        
        
        
        
        from:Date,

        to: Date,
        
        action:{
            type:String,
            enum:["pending","approved","denied"],
            default:"pending"
        },

        reason :{
            type:String, required:"subject cant be blank"
        },
        action:{
            type:String,
            enum:["pending","approved","denied"],
            default:"pending"
        },
        
        approved:{
            type:Boolean,
            default:false
        },
        denied:{
            type:Boolean,
            default:false
        },
        empl:{
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Employee"
            },
            username:String

        }

    },
    {timestamps:{}}
);

module.exports = mongoose.model("Leave",leaveSchema);



// const mongoose = require('mongoose');

// const leaveSchema = new mongoose.Schema({
//   employeeId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Employee',
//     required: true
//   },
//   leaveType: {
//     type: String,
//     enum: ['sick', 'vacation', 'maternity/paternity', 'bereavement'],
//     required: true
//   },
//   startDate: {
//     type: Date,
//     required: true
//   },
//   endDate: {
//     type: Date,
//     required: true
//   },
//   reason: {
//     type: String,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending'
//   }
// }, { timestamps: true });

// const Leave = mongoose.model('Leave', leaveSchema);

// module.exports = Leave;

