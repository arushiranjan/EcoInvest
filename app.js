const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Invest = require("./models/Invest.js");
const ProductEmission = require("./models/Product.js");
const methodOverride = require("method-override");
const session = require("express-session");
const User = require("./models/user.js");

app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB Atlas
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




app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);



const sessionOption = {
    secret: 'mysupersecretcode',
    resave:false,
    saveUninitialized:true,
    cookie : {
        expires : Date.now() +  1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
};


app.use(session(sessionOption));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

app.get("/",(req,res)=>{
    res.render("main.ejs");
})


app.get("/demo",async (req,res)=>{
    const data = await Invest.find({});
    console.log(data);
    res.render("comparison.ejs", {data})
})


// app.get("/demo",async (req,res)=>{
//   const productData = await ProductEmission.find({});
//   console.log(productData);
//   res.render("compareProduct.ejs", {productData});
// })


app.post("/signup", async (req, res) => {
  try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
          if (err) {
              next(err);
          }
          res.redirect("/");
      })
  } catch (err) {
      res.render("signup.ejs", { error: err.message }); 
  }
})

app.get("/signup", async (req, res) => {
  res.render("signup.ejs");
})

app.get("/login", async (req, res) => {
  res.render("login.ejs");
})


app.post("/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);


app.get("/logout", (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect("/");
  });
});