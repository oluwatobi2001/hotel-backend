const User = require("../model/User")
const Room = require("../model/room")
const Hotel = require("../model/Hotel");
const RoomReview = require("../model/RoomReviews")



const viewAvailablerooms =   async(req, res) => {
try {
const availableRooms =  await Room.find({isAvailable: 'true'});
res.status(200).json(availableRooms);

} catch(err) {
    res.status(500).json(err)
}
}
const bookRoom =  async(req, res) => {
const user = req.user;
const roomId = req.params.id;
const bookedTillDate = req.body.bookedDate;
const bookDurationLenght = req.body.bookDurationLenght
 try {
    const roomAvailability = await Room.findById(roomId);
    if (roomAvailability.isAvailable !== true) {
      res.status(400).json("sorry, room isn't available currently")  
    }
    const bookRoom = await Room.findByIdAndUpdate(roomId, {$set:{ isAvailable: false, bookedTill : bookedTillDate , bookedBy : req.user.id , dateOfBooking: new Date(), bookDuration :bookDurationLenght}}, {new: true})
console.log(bookRoom);
res.status(200).json("Room successfuly booked")
} catch(err) {
    console.log(err)
    res.status(500).json(err)
}

}
const viewAllRooms =  async(req, res) => {

try {
const allRooms = await Room.find().limit(15);
console.log(allRooms)
res.status(200).json(allRooms)
} catch(err) {
res.status(400).json(err)
}
}
const checkOut =  async(req, res) => {
    const user  = req.user.id;
    const roomId = req.params.id;
    try {

  
    
    const roomCheck = await  Room.findById(roomId).populate("bookedBy")
    console.log(roomCheck);
    if(!roomCheck.bookedBy === user) {
        res.status(400).json("SOrry, you arent allowed to access this")
    }
    const checkingOut =await Room.findByIdAndUpdate(roomId, {$set:{ isAvailable: true, bookedTill :null , bookedBy : null , dateOfBooking: null, bookDuration :null}}, {new: true})
console.log(checkingOut)
res.status(200).json("successfully checked out")
  } catch(err) {
      console.log(err)
      res.status(500).json("operation not successful. Please try again")
  }
}


const viewSpecificRoom = async(req, res) => {
    const roomNo  =  req.params.id;
    try {
        const RoomDetails =  await Room.findById(roomNo).populate("roomReviews");
        console.log(RoomDetails);
        res.status(200).json(RoomDetails);

    } catch(err) {
        console.log(err);
        res.status(500).json("Sorry, you cannot access this information now. Kindly try again later")
    }
}
const roomReview =  async(req, res) => {
    const user = req.user.id
    if(!user) {
        res.status(400).json("Error; please login and try again")
    }

    try {
        const reviewBody = {
            reviewer : req.user.username,
            review: req.body.review,
            roomId: req.body.roomId

        }
        console.log(reviewBody)
const makeReview = await RoomReview.create(reviewBody);
console.log(makeReview);
res.status(200).json("Review successfully made")
    } catch(err) {
console.log(err)
        res.status(500).json("Operation not successful. Please try again later")

    }
}

module.exports = {roomReview, viewSpecificRoom,  checkOut, bookRoom, viewAvailablerooms , viewAllRooms}