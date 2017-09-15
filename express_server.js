const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}


app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "5b4xy8": "http://www.facebook.com"
};

function generateRandomString() {
  randomString = Math.random().toString(36).substring(2, 8);
  return randomString;
}

// route to urlDatabase (main page)
app.get("/urls", (req, result, user_id) => {
  let templateVars = {
    urls: urlDatabase,
    user_id: req.cookies.user_id
  };
  result.render("urls_index", templateVars);
});
// get request renders new tinyURL maker page
app.get("/urls/new", (req, result, user_id) => {
  let templateVars = {
    longURL: urlDatabase[req.params.shorturl],
    user_id: req.cookies.user_id
  }
  result.render("urls_new", templateVars);
});
// route to urlshortenedURL page to edit
app.post("/urls/:shortURL", (req, result, user_id) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    targetURL: urlDatabase[req.params.shortURL],
    user_id: req.cookies.user_id
  }
  result.render("urls_show", templateVars);
});
app.get("/urls/register", (req, result, user_id) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    targetURL: urlDatabase[req.params.shortURL],
    user_id: req.cookies.user_id
  }
  result.render("urls_register", templateVars);
});

//new generated link page
app.post("/urls", (req, result) => {
  let templateVars = {
    longURL: urlDatabase[req.params.shorturl]
  }
  rString = generateRandomString(); // generate random string
  urlDatabase[rString] = req.body.longURL; // redefine string

  result.redirect("/urls");
});
//   delete object.property
app.post("/urls/:id/delete", (req, result) => {
  delete(urlDatabase[req.params.id]); // delete my object id from the html form
  result.redirect("http://localhost:8080/urls/"); // redirect to main page
});
//   edit the value of the long url to the new input
app.post("/urls/:id/update", (req, result) => {
  urlDatabase[req.params.id] = req.body.longURL;
  result.redirect("http://localhost:8080/urls/"); // redirect to main page
});
// //get a login username and create a user cookie
// app.post("/login", (req, res) => { //recieves cooking and redirects
//   res.cookie('username', req.body.user_id);
//   console.log(req.cookies.user_id);
//   res.redirect("back");
// });
// //get a logout username and create a user cookie
// app.post("/logout", (req, res) => { //recieves cooking and redirects
//   res.clearCookie('user_id');
//   res.redirect("back");
// });
//for returning the cookie to display back to user
app.post("/urls", (req, res) => { //writes username cookie to server
  let templateVars = {
    user_id: req.cookies.user_id
  }
  res.cookie("user_id", req.body.user_id);
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res, user_id) => {
  let templateVars = {
    shorturl: req.params.shortURL,
    targetURL: urlDatabase[req.params.shortURL],
    user_id: req.cookies.user_id
  }
});

app.post("/register", (req, res, user_id) => {
  let userEmail = req.body.email;
  let userEPass = req.body.password;
  let rString = generateRandomString();
  if (userEmail == false || userEmail == false) {
    res.send("400 ERROR. Enter a Valid User ID and/or Password");
  }
  users[rString] = {
    id: rString,
    email: userEmail,
    password: userEPass
  };
  res.cookie("user_id", users[rString].id);
  res.redirect("/urls");
});

app.get("/urls/login", (req, res, user_id) => {
  let templateVars = {
    shorturl: req.params.shortURL,
    targetURL: urlDatabase[req.params.shortURL],
    user_id: req.cookies.user_id
  }
  res.render("urls_login", templateVars);
});

// get a login user_id/password and create a user cookie
app.post("/login", (req, res, user_id) => {
  let userEmail = req.body.email;
  let userEPass = req.body.password;
  for (id in users) {
    if (userEmail === -user[id].email && userEPass === users[id].password) {
      res.cookie("user_id", id);
      res.redirect("/urls");
    }
  }
  res.send("NO USER EXISTS");
});

//get logout user_id and create a user cookie
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

//returning the cookie to display back to the user
app.post("/urls", (req, res) => {
  let templateVars = {
    user_id: req.cookies.user_id
  }
  res.cookie("user_id", req.body.user_id);
  res.render("urls_index", templateVars);
});

//port message on the console
app.listen(PORT, () => {
  console.log(`tiny url app listening on port ${PORT}!`);
});