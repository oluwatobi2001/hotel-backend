const jwt = require("jsonwebtoken");

const User  = require("../model/User")
const RoomReview =  require("../model/RoomReviews")

const authenticate = async (req, res, next) => {
const authorizationHeader = req.headers.authorization;

if(!authorizationHeader || !authorizationHeader.startsWith("Bearer") ) {
    return res.status(401).json({ error: "You are not authorized to access this. No token"})
}
try {
    const token = authorizationHeader.split(" ")[1];
    if(!token) {
        return res.status(401).json({ error: "You are not authorized to access this. No token"})
    }
    const decoded = jwt.verify(token, process.env.JWT);
    console.log(decoded);
    if(!decoded || !decoded.userID ) {
        return res.status(401).json({ error: "Invalid token"})
    }
    console.log(decoded.userID)
    const user = await User.find(decoded.userID)
console.log(user);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    delete req.user.password;

    next();


} 
catch(err) {
    console.error(err);
    return res.status(401).json({err})

}
}


const checkIsAdmin = async(req, res, next) => {
    const authorizationHeader = req.headers.authorization;

if(!authorizationHeader || !authorizationHeader.startsWith("Bearer") ) {
    return res.status(401).json({ error: "You are not authorized to access this. No token"})
}
try {
    const token = authorizationHeader.split(" ")[1];
    if(!token) {
        return res.status(401).json({ error: "You are not authorized to access this. No token"})
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log(decoded);
    if(!decoded || !decoded.username ) {
        return res.status(401).json({ error: "Invalid token"})
    }
    console.log(decoded.username);
    const {username} = decoded;
    const user = await User.findOne({username})
console.log(user);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.role !== 'admin') {
        return res.status(401).json({ error: "only admins are allowed to access this" });
    }
    req.user = user;
    delete req.user.password;

    next();


} 
catch(err) {
    console.error(err);
    return res.status(401).json({err})

}
}
const checkVerification = async(req, res, next) => {
    
const RegUser = req.body.username;
 try {

 
const  user =  await User.findOne({username : RegUser})
console.log(user)

const verifiedUser =  await user.isVerified;
console.log(verifiedUser)
if(!verifiedUser) {
        return res.status(401).json({ error: "You cannot login yet. Verify your account" });
    }
    req.user = user;
    delete req.user.password;

    next();


} 
catch(err) {
    console.error(err);
    return res.status(401).json({err})

}
}

const UserRouteVerification = async(req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if(!authorizationHeader || !authorizationHeader.startsWith("Bearer") ) {
        return res.status(401).json({ error: "You are not authorized to access this. No token"})
    }
    try {
        const token = authorizationHeader.split(" ")[1];
        if(!token) {
            return res.status(401).json({ error: "You are not authorized to access this. No token"})
        }
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log(decoded);
        if(!decoded || !decoded.username ) {
            return res.status(401).json({ error: "Invalid token"})
        }
        if( decoded.isVerified === "false") {
            res.status(401).json("Your account is not yet verified and you aren't alowed to access this section")
        }
       req.user = decoded;
        next()
    }
    catch(err) {
    console.log(err);
    res.status(500).json(err)
    }
}
module.exports = { authenticate, checkVerification, checkIsAdmin, UserRouteVerification }