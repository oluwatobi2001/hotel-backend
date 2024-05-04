const mongoose = require("mongoose")
const roomSchema = require("../model/room.js")
const Schema = mongoose.Schema;
const HotelSchema = mongoose.Schema({
HotelName : {
    type: String,
    required : true
}
,
HotelAddress : {
    type: String,
    required: true
},
rooms: [
    {type: Schema.Types.ObjectId, 
     ref: 'Room'}
    ]
})
module.exports = mongoose.model("Hotel", HotelSchema)