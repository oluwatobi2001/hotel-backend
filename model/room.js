const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Import Schema from mongoose

const RoomSchema = new Schema({
    
    roomId: {
        type: Number,
        unique: true
    },
    roomDesc: {
        type: String,
        required: true
    },
    roomType: {
        type  : String,
enum: ["regular", "executive", "presidential"],
basic: "regular",
required : true
    },
    isAvailable: {
        type: Boolean,
        default: true  // 'boolean' should be 'Boolean'
    },
    bookedTill: {
        type: Date
    },
    bookedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
         // Assuming this is for the user who booked the room
    dateOfBooking: {
        type: Date
    },
    bookDuration: {
        type: Number
    },
    roomPrice: {
        type: Number,
        required: true
    },
    roomReviews : 
        [
            {type: Schema.Types.ObjectId, 
             ref: 'RoomReviews'}
            ]   
    
});

module.exports = mongoose.model("Room", RoomSchema); // Use "Room" instead of "room" for the model name
