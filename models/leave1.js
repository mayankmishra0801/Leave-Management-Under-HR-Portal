var mongoose = require("mongoose");
var leaveSchema = new mongoose.Schema({

employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
      },

      employeeName:{
        type:String,
        required:true,
      },

      employeeEmail:{
       type:String,
       required:true,
      },

  month1:{

 

  },  


month:[{


   january:{
      leaves:[{
       from:{
           type: Date,
            
       },
       to:{
           type: Date,
           
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
    
   }]

      
}






}],      
      
  
  })





     