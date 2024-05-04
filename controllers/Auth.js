const jwt = require('jsonwebtoken');
const User = require("../model/User.js");
const Joi  = require("joi");
const Otp = require("../model/OtpVerify");


const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt");


const regSchema = Joi.object({
    emailAddress: Joi.string().email({minDomainSegments: 2, tlds: {
        allow: ['com', 'net']
    }}),
    username: Joi.string().alphanum().min(3).max(15).required(),
    password: Joi.string().min(8).required(),
    fullName: Joi.string().max(14).required(),
    role: Joi.string().required()
})
exports.register = async(req, res) => {
const{error, value } = regSchema.validate(req.body, {abortEarly: false});

if (error) {
    res.status(400).json(error);
}

    try {
        
        
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log(hashedPassword);

const userDetails = {
    username: req.body.username,
    password: hashedPassword,
    fullName : req.body.fullName,
    emailAddress: req.body.emailAddress, role : req.body.role
}
const OTP =  await otpGenerator.generate(5, {
   lowerCaseAlphabets: false, digits: true, specialChars: false, upperCaseAlphabets: false
})
console.log(OTP);

const newUser = await User.create(userDetails);
console.log(newUser);

        const { username} = newUser;
        const otp = Otp.create({userId : username, otpNo : OTP});
console.log(otp)
        const token = jwt.sign({ username}, "Tobi");
res.status(200).json({ username , token, OTP});

    }
    catch(err) {
        res.status(500).json(err)

    }
}


exports.UserVerification = async(req, res) => {
    const OtpNumber =  req.body.otp;

if(!OtpNumber) {
res.status(400).json("No verification code")
}
const confirmOtp = await Otp.findOne({otpNo : OtpNumber}) ;
console.log(confirmOtp);

if(!confirmOtp.userId) {
    res.status(400).json("Invalid OTP: Ensure the otp entered is correct")
}
const {userId} = confirmOtp;
const confirmUser   =  await User.findOne({username: userId})
console.log(confirmUser)
if(!confirmUser.username) {
    res.status(200).json("Invalid User")
}
try {
  const confirm = await User.findOneAndUpdate({username: confirmUser.username}, {isVerified: true}, {new: true});
  console.log(confirm)
  const deleteOtp = await Otp.deleteOne({otpNo: OtpNumber})
  res.status(200).json("User successfully verified")
} catch(err) 
{
    res.status(500).json(err)
}
}
exports.login = async(req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res
          .status(400)
          .json({ error: "Email or Password fields cannot be empty!" });
        return;
      }
    try {
const loginUser = await User.findOne({username : req.body.username});

if(!loginUser.username) {
    res.status(400).json("Invalid Username. Check if it's correct")
}

const passwordMatch = await bcrypt.compare(
    password, loginUser.password
)
if (!passwordMatch) {
    res.status(400).json("Incorrect password")
}

const {id, username , isVerified } = loginUser;
console.log(process.env.SECRET)
const token = jwt.sign({id, username, isVerified}, process.env.SECRET, {expiresIn: '1h'});
res.status(201).json({id, username , token});


    }
    catch(err) {
        console.log(err)
       res.status(500).json("error : Login failed")
    }
}