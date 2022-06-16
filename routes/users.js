const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users");

router.get("/", UsersController.Index);
router.get("/new", UsersController.New);
//2. when someone is directed to users/new, a get request is sent 
//to the server. UsersController.New is how we determine how we want to 
//handle the request and send the response
router.post("/", UsersController.Create);
//5. when a request is made to this route (i.e. when someone signs up) 
//the user controller runs create
router.post("/add-friend", UsersController.AddFriend);
//confused... not sure I'm using this properly
//my understanding, if we post to users/add-friend, then we run 
// AddFriend in the controller to create a friend using data supplied 
//in the form from which we're making the post request

module.exports = router;

//make a new route for friends so we can use a session-checker to see if
//someone is logged in
//change form to route to new routes file and thus new handler
//we can now update the target friend's friends array, we need to be able to update
//the user's friends array
//
