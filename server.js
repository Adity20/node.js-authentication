const express = require("express");
const path = require("path");
const app = express();
const port = 2000;
const mongoose = require("mongoose");
//connect to mongoose
mongoose
  .connect(
    "mongodb+srv://sharmaatul9164:Aditya20@cluster0.sfpab7o.mongodb.net/"   
  )
  .then(() => console.log("Db connected"))
  .catch(err => console.log(err.message));

const userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  password: String,
  image: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/08/05/04/25/people-875617_960_720.jpg",
  },
});
//model

const User = mongoose.model("User", userSchema);

//static files

app.use(express.static(__dirname, +"/public"));
// or
// Virtual Path Prefix '/static'
// app.use("/static", express.static("public"));

//view engine setup ejs
app.set("view engine", "ejs");
//pass json data
app.use(express.json());

//pass form data
app.use(express.urlencoded({ extended: true }));

//routes
app.get("/", (req, res) => {
  res.render("index");
});

//login form
app.get("/login", (req, res) => {
  res.render("login");
});

//login logic
app.post("/login", async (req, res) => {
  //get the username and password
  let username = req.body.username;
  let userPassword = req.body.password;
  //find the user inside mongodb
  const userFound = await User.findOne({ username });
  const password = await User.findOne({ password: userPassword });
  if (!userFound || !password) {
    return res.json({
      msg: "Invalid login credentials",
    });
  }
  console.log("Login success");
  //API
  // res.json({
  //   msg: "Login Success",
  //   userFound,
  // });
  res.redirect(`/profile/${userFound._id}`);
});

//get  Register form
app.get("/register", (req, res) => {
  res.render("register");
});

//Register user
app.post("/register", (req, res) => {
  //register user
  User.create({
    fullName: req.body.fullName,
    username: req.body.username,
    password: req.body.password,
  })
    .then(user => {
      res.redirect("/login");
    })
    .catch(err => console.log(err));
});

//profile
app.get("/profile/:id", async (req, res) => {
  //find the user by ID
  const user = await User.findById(req.params.id);
  res.render("profile", { user });
});

//listen
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

//63089741fe2ca4e24fd4853c
