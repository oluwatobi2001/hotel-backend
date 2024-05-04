const router = require('express').Router();
const {checkVerification, checkIsAdmin} = require("../Middleware/Authentication")

const {createHotel, upgradeUser ,  upDateHotelDetails,  addRoom, updateRoom, getRoomsDetails, removeUser} = require("../controllers/Admin")

router.post("/new-hotel", checkIsAdmin, createHotel);
router.delete("/delete-user/:id", checkIsAdmin, removeUser);
router.put("/update-hotel", checkIsAdmin, upDateHotelDetails);
router.post("/:id/add-room", checkIsAdmin, addRoom);
router.get("/get-room-details/:id", checkIsAdmin, getRoomsDetails);
router.put("/update-room", checkIsAdmin, updateRoom);
router.put("/update-user/:id", checkIsAdmin, upgradeUser);
module.exports = router
