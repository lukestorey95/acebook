const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
//see the model as part of the database, setting the rules for the database 
const UserSchema = new mongoose.Schema({
  //user schema can be seen as the outline/outlay of the database 
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile_picture: { type: String, default: null },

  // friends: { 
  //   type: String,
  //   default: null
  // }

  friends:[{
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  }],
});
//is the above how you write a foreign key for the User table?
//also is it still a foreign key if it's searching for other users in the same table?

UserSchema.pre("save", function (next) {
  const user = this;

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          user.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (error, isMatch) {
    if (error) {
      return callback(error);
    } else {
      callback(null, isMatch);
    }
  });
};

module.exports = mongoose.model("User", UserSchema);
