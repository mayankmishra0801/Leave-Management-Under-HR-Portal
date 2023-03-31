var mongoose = require("mongoose");
var leaveSchema = new mongoose.Schema(
    {

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
            username:string

        }

    },
    {timestamps:{}}
);

module.exports = mongoose.model("Leave",leaveSchema);
