const router= require('express').Router();

const {checkVerification, checkIsAdmin} = require("../Middleware/Authentication")
const handle = require("../controllers/index.js");

router.post('/register', handle.register);
router.post('/register/verify', handle.UserVerification);

router.post("/login", checkVerification,  handle.login);


module.exports = router;