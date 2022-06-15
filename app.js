const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const methodOverride = require("method-override");
const flash = require("express-flash");

const homeRouter = require("./routes/home");
const postsRouter = require("./routes/posts");
const sessionsRouter = require("./routes/sessions");
const usersRouter = require("./routes/users");
const commentsRouter = require("./routes/comments");
const likesRouter = require("./routes/likes");
const profileRouter = require("./routes/profile");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

const hbs = require("hbs");
hbs.registerPartials(path.join(__dirname, "/views/partials"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/images")));
app.use(methodOverride("_method"));

// Error flash module
app.use(flash());

app.use(
  session({
    key: "user_sid",
    secret: "super_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

// clear the cookies after user logs out
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
  if (!req.session.user && !req.cookies.user_sid) {
    res.redirect("/sessions/new");
  } else {
    next();
  }
};

// route setup
app.use("/", homeRouter);
app.use("/posts", sessionChecker, postsRouter);
app.use("/sessions", sessionsRouter);
app.use("/users", usersRouter);
//when something happens on /users, check the usersRouter
app.use("/comments", sessionChecker, commentsRouter);
app.use("/likes", sessionChecker, likesRouter);
app.use("/profile", sessionChecker, profileRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

//app.js 72 
//routes/users.js 7 //2. when someone is directed to users/new, a get request is sent
//to the server. UsersController.New is how we determine how we want to 
//handle the request and send the response
//routes/users.js 11 //5. when a request is made to this route (i.e. when someone signs up) 
//the user controller runs create
//controllers/users.js line 6 //read the above as our response is to render the users/new page
//controllers/users.js line 11 //CONTROLLER IS THE SERVER FOR THE PURPOSES OF OUR UNDERSTANDING HERE 
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
//ibid 31 //this is a mongoose method - saves user to database 
//ibid 35 //sends a 201 status to the client (i.e. web browser)
        //read the above as our response is to give a 201 status and 
        //a redirect
//ibid 47 //6. Unlike the get request, which is simply rendering the page, this is handling a 
//post request. Request has all the form data that the user submitted. We want to get this
//data to the database. 
//views/users/new.hbs  {{!-- 4. when you submit the form, it makes a post request to /users - this is 
                // defined in the app.js as the users router --}}
//model - //see the model as part of the database, setting the rules for the database 
//model line 7 //user schema can be seen as the outline/outlay of the database 
