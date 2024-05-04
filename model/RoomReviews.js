const mongoose = require("mongoose");

const RoomsReviewsSchema  = mongoose.Schema({
    roomId:  {
type: String, required: true
    },
    review : {
        type: String, required: true
    },
    reviewer: {
        type: String, required: true
    }

})

module.exports = mongoose.model("roomReviews", RoomsReviewsSchema)