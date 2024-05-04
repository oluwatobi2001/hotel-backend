const router = require('express').Router();
const User = require("../model/User");
const {UserRouteVerification, checkIsAdmin,} = require("../Middleware/Authentication")

const {roomReview, checkOut, bookRoom, viewSpecificRoom,  viewAllRooms, viewAvailablerooms} = require("../controllers/User")



router.put("/:id/add-review",  UserRouteVerification, roomReview);
router.put("/:id/check-out", UserRouteVerification, checkOut);
router.post("/:id/book-room", UserRouteVerification, bookRoom);
router.get("/all-rooms", UserRouteVerification, viewAllRooms);
router.get("/rooms/:1d", UserRouteVerification, viewSpecificRoom);
router.get("/available-rooms", UserRouteVerification, viewAvailablerooms)

module.exports = router ;