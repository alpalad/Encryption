//jshint esversion:6
require("dotenv").config();
const express= require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

// console.log(process.env.API_Key);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

// const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);



app.get("/",function(req,res){
  res.render("home");
})

app.get("/login",function(req,res){
  res.render("Login");
})

app.get("/register", function(req,res){
  res.render("register");
})

app.post("/login", function(req,res){
  console.log(req.body);
  const formUsername = req.body.username;
  const formPassword = req.body.password;
  User.findOne({email: formUsername}, function(err, foundUser){
    if (err){
      console.log(err);
    }else{
      if (foundUser){
        if (foundUser.password === formPassword){
          res.render("secrets");
        }else{
          console.log("Incorrect password");
        }
      }else{
        console.log("User found : " + foundUser);
      }
    }
  });
})

app.post("/register", function(req,res){
  console.log(req.body);
  // User.findOne({email: req.body.username},function(err){
  //   if(err){
  //     console.log(err);
  //   }else{
  //     console.log("User is already in the system!");
  //   }
  // })

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })
  newUser.save(function(err){
    if (err) {
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
  // res.redirect("/");
})


app.listen(3000,function(req,res){
  console.log("System if running on port 3000");
})
