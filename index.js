const express  =  require('express');
const app= express();

const mongoose = require('mongoose')
const cors = require('cors') ;
const bodyParser = require('body-parser') 
const authRoute = require("./routes/Auth")
const dotenv = require('dotenv') 

const userRoute =  require("./routes/Users")
const adminRoute =  require("./routes/Admin")
dotenv.config();
app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://localhost/hotel' ,   /* process.env.MONGO_URL, */ {useNewUrlParser: true,
 
 }).then(console.log("connected to mongo db")).catch((err) => console.log(err)); 



 app.use(bodyParser.json());
app.use("/api", authRoute);
app.use("/api", adminRoute)
app.use("/api", userRoute)
 app.listen(process.env.PORT  || 5000, ()=> {
    console.log("tobi is king");
})
