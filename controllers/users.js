const User = require("../models/user");

const UsersController = {
  New: (req, res) => {
    res.render("users/new", {
      //read the above as our response is to render the users/new page
      session: req.session.user,
      error: req.flash("error"),
    });
  },
  //CONTROLLER IS THE SERVER FOR THE PURPOSES OF OUR UNDERSTANDING HERE 
  //3. UsersController takes a request and response. Express has things set 
  //up so that when someone lands on a page, it takes a request and expects to 
  //give a reponse. If you don't give a response in the above function, the user
  //won't see anything. Our resonse here is simply render the page. 
  //The syntax is res.render(page you want to render)
  //in this example we've also provided an optional object with more data that the view
  //might find useful - the session data, and any error messages
  //see the app as the container encapsulating the controller and the view (in this case -
  //other interactions with the website might use other file-types). Think of the controller
  //as the central hub within the app, interacting with any other relevant files. 
  //the model only comes into things if we need to interact with the database - see
  //the model as the database when it comes to express


  Create: (req, res) => {
    const user = new User(req.body);

    user
      .save()
      //this is a mongoose method - saves user to database 

      .then(() => {
        res.status(201).redirect("/sessions/new");
        //sends a 201 status to the client (i.e. web browser)
        //read the above as our response is to give a 201 status and 
        //a redirect
      })

      .catch((err) => {
        if (err.code === 11000) req.flash("error", "Email already exists");

        res.redirect("/users/new");
      });
  },
};
//6. Unlike the get request, which is simply rendering the page, this is handling a 
//post request. Request has all the form data that the user submitted. We want to get this
//data to the database. 

module.exports = UsersController;
