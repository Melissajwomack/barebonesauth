const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const UserSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true }
})

UserSchema.pre('save', function(next){
  if(this.isModified('password') || this.isNew){
    bcrypt.hash(this.password, null, null, (err, hash) => {
      if(err){
        console.log(err);
        return next(err);
      }
      this.password = hash;
      return next();
    })
  }
})

UserSchema.methods.comparePassword = function(pass, cb){
  bcrypt.compare(pass, this.password, function(err, isMatch) {
      if(err){ return cb(err); }
      cb(null, isMatch);
  });
}

const User = mongoose.model("User", UserSchema);


module.exports = User;
