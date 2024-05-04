const mongoose = require("mongoose");


const otpSchema = new mongoose.Schema({
userId: {
    type: String,
    required: true
},
otpNo : {
    type: String, 
    required : true
}, createdAt : {
    type: Date, default: Date.now , index: {
        expires: 40000
    }
}
}, {timestamps: true})

module.exports  = mongoose.model("otp", otpSchema)