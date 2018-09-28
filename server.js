const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/User");

const jwt = require("jsonwebtoken");
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
mongoose.connect("mongodb://localhost/passporttest")

const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

const passportOptions = {
  jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "keyboard_cat"
}

passport.use(new JwtStrategy(
  passportOptions,
  (jwt_payload, done) => {
    User.findOne({_id: jwt_payload._id}, (err, user) => {
      if(user){
        done(null, user)
      } else {
        done(null, false)
      }
    })
  }
));

app.get("/hello", passport.authenticate("jwt", {session: false}), (req, res) => {
  res.json({
    email: req.user.email,
    timestamp: +Date.now()
  });
});

app.post("/api/register", (req, res) => {
  const user = new User(req.body);

  user.save(function(err){
    if(err){
      console.log(err);
      return res.json({success: false, message: err})
    } else {
      return res.json({success: true, message: "Created a new user"})
    }
  })
})

app.post("/api/login", (req, res) => {
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if(!user){
      return res.status(401).send({success: false})
    } else {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if(err || !isMatch){
          return res.status(401).send({success: false})
        } else {

          const token = jwt.sign({ _id: user._id }, "keyboard_cat")
          return res.status(200).send({success: true, token: token})
        }
      })
    }
  })
})

app.listen(3001, () => {
  console.log("LISTENING ON PORT 3001");
});
