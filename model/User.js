const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
username: {
    type: String,
    required: true,
    unique: true
},
emailAddress: {
    type: String,
    required: true, unique: true
},
password: {
    type: String,
    required: true
},
fullName: {
    type: String,
    required : true
},
location : {

    type: String
},
role :  {
type  : String,
enum: ["user", "admin"],


},
isVerified : {
    type: Boolean,
    default: false
}
})

module.exports = mongoose.model("User", UserSchema)