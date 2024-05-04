const User = require("../model/User")
const Room = require("../model/room")
const Hotel = require("../model/Hotel");

const Joi = require("joi")


const createHotel = async(req, res) => {
 
    try {
        const newHotel = await Hotel.create(req.body);
        console.log(newHotel);
        res.status(200).json("Hotel successfully created")

    } catch(err) {
        res.status(500).json(err) 
    }
}
const addRoom = async(req, res) =>{
    const   user = req.user;
   const HotelId= req.params.id;


try {
    const newRoom  = await Room.create(req.body);
const hotelUpdated = await Hotel.findByIdAndUpdate({_id: HotelId} , {$push : {rooms: newRoom._id}} )

    console.log(newRoom);
    res.status(200).json("ROom Successfully created")

}
catch(err) {
    console.log(err)
    res.status(500).json(err)
}

}

const upDateHotelDetails = async(req, res) => {
    try {
        const upgradedHotel = await Hotel.findByIdAndUpdate(userUp, {$set  : {role: "admin"}});
        console.log(upgradedUser)
        res.status(200).json("Upgrade successful")
    }
catch(err) {
    res.status(500).json(err)
}
}
const removeUser =async(req, res) => {
   
const defaultUser = req.params.id
const   user = req.user;

try {
    const deleteUser =  await User.findByIdAndDelete(defaultUser);
    res.status(200).json("user successfully deleted")
}
catch(err) {
    res.status(500).json(err)
}
     

}
const getRoomsDetails = async(req, res) => {
    const Admin =  req.user.id ;
    const roomNo = req.params.id
   
        try {
const roomDetails = await Room.findOne(roomNo)
res.status(200).json(roomDetails)
        } catch(err) {
            res.status(500).json(err)
        }


}
const updateRoom = async(req, res) => {
    const   user = req.user;
    if(!user.isAdmin){
        res.status(400).json("Please you are not authorized to access this page");
    }

    const roomNo = req.params.id ;
   
    try {
const roomUpdated = await Room.findByIdAndUpdate(roomNo, {$set: room})

    } catch (err) {
res.status(500).json(err)
    }

}

const upgradeUser =  async(req, res) => {

    const userUp = req.params.id ;
    const   user = req.user;
   
    try {
        const upgradedUser = await User.findByIdAndUpdate(userUp, {$set  : {role: "admin"}});
        console.log(upgradedUser)
        res.status(200).json("Upgrade successful")
    }
catch(err) {
    res.status(500).json(err)
}
}

module.exports = {createHotel, upgradeUser ,  upDateHotelDetails,  addRoom, updateRoom, getRoomsDetails, removeUser}