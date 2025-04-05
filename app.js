const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Invest = require("./models/Invest.js");

app.use(express.urlencoded({ extended: true }));


async function main() {
  try {
    await mongoose.connect('mongodb+srv://admin:admin123@cluster0.j6gihrp.mongodb.net/ecoInvestDB?retryWrites=true&w=majority');
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
main();

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is listening on port ${port}`);
});




const methodOverride = require("method-override");
app.use(methodOverride("_method"));




app.use(express.urlencoded({extended:true}));




// creating session
// const sessionOption = {
//     secret: 'mysupersecretcode',
//     resave:false,
//     saveUninitialized:true,
//     cookie : {
//         expires : Date.now() +  1000 * 60 * 60 * 24 * 7,
//         maxAge : 1000 * 60 * 60 * 24 * 7,
//         httpOnly: true,
//     }
// };


// app.use(session(sessionOption));
// app.use(flash());


// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));


// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));



app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);
// app.get("/test",(req,res)=>{
//     let test = new Listing({
//         title : "bunking palace",
//         description : "This is an absolute gem which can't be neglected",
//         location  : "Russia city",
//         price : 100000,
//         country : "Russia",
//     });
//     test.save().then(()=>{
//         res.send("data saved")
//     }).catch((err)=>{
//         console.log(err);
//     })
// })

app.get("/",(req,res)=>{
    res.render("main.ejs",{items});
})


app.get("/demo",async (req,res)=>{
    const data = await Invest.find({});
    res.render("comparison.ejs", {data})
})