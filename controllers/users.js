const User = require("../models/user");

const UsersController = {
  Index: (req, res) => {
    User.find()
      .exec((err, users) => {
        if (err) {
          throw err;
        }
        let reversedUsers = users.reverse();

        const result = reversedUsers.filter((user) => {
          return user._id != req.session.user._id
        });
        
        res.render("users/index", {
          session: req.session.user,
          users: result,
        });
      })
  },

  New: (req, res) => {
    res.render("users/new", {
      session: req.session.user,
      error: req.flash("error"),
    });
  },
  Create: (req, res) => {
    const user = new User(req.body);

    user
      .save()
      .then(() => {
        res.status(201).redirect("/sessions/new");
      })
      
      .catch((err) => {
        if (err.code === 11000) req.flash("error", "Email already exists");

        res.redirect("/users/new");

      });
  },

  AddFriend: (req, res) => {
  //   const post_id = req.body.post_id;
    // const friend = new User(req.body);
    // const friend = req.body; 
    //is the request whatever is sent via the post method to via the route that leads to AddFriend?
    
  
      const filter = { _id: req.body.user_id };
      //filter = the id of the person the logged-in person wants to be friends with
      //filter = the target
      const update = {$push: {friends: req.session.user._id}};
      //update = push the user id of the logged-in person (req.session.user._id) into the desired friend's friends array 
      User.findOneAndUpdate(filter, update, {new: true, useFindAndModify: false}, (err) => {
        if (err) {
          console.log(err);
          throw err;
        }

      const filter2 = { _id: req.session.user._id };
      //filter2 = the id of the logged-in person 
      //filter2 = i.e. the target
      const update2 = {$push: {friends: req.body.user_id}};
      //update2 = push the id of the desired friend into the friends 'column' of the logged in person

      User.findOneAndUpdate(filter2, update2, {new: true, useFindAndModify: false}, (err) => {
        if (err) {
          console.log(err);
          throw err;
        }

      //need to define filter and update for pushing a friend into the logged-in user's friends array 
      // here and then run findOneAndUpdate again
        res.status(201).redirect(`/profile/${req.session.user._id}`);
      });
    });
  },    
};
 //6. Unlike the get request, which is simply rendering the page, this is handling a 
//post request. Request has all the form data that the user submitted. We want to get this
//data to the database.

module.exports = UsersController;
