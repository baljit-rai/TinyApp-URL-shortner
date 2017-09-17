const express = require("express");
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
let currentUsername = '';


app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.get('/', function(req, res, next) {
  // Update views
  req.session.views = (req.session.views || 0) + 1

  // Write response
  res.end(req.session.views + ' views')
})

// app.listen(8080)
app.set("view engine", "ejs");

let urlDatabase = {
  "b2xVn2": {
    fullURL: "http://www.lighthouselabs.ca",
    userPoster: "asX412"
  },
  "9sm5xK": {
    fullURL: "http://www.google.com",
    userPoster: "asX412"
  },
  "5b4xy8": {
    fullURL: "http://www.facebook.com",
    userPoster: "asdf452"
  }
};

let users = {
  "asX412": {
    id: "userRandomID",
    email: "bsrai91@gmail.com",
    password: bcrypt.hashSync("12345", 10)
  },
  "asdf452": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  }
};

function generateRandomString() {
  randomString = Math.random().toString(36).substring(2, 8);
  return randomString;
};

// route to urlDatabase (main page)
app.get("/urls", (req, res, user_id) => {
  let filteredDatabase = {}; //filter session to show only user data when logged in

  for (i in urlDatabase) {
    if (req.session.user_id === urlDatabase[i].userPoster) {
      filteredDatabase[i] = urlDatabase[i];
    } else if (req.session.user_id === undefined) {
      filteredDatabase = urlDatabase;
      break;
    }
  }
  let templateVars = {
    urls: filteredDatabase,
    user_id: req.session.user_id
  };
  res.render("urls_index", templateVars);
});
// get request renders new tinyURL maker page
app.get("/urls/new", (req, res, user_id) => {

  let templateVars = {
    longURL: urlDatabase[req.params.shorturl],
    user_id: req.session.user_id
  }
  if (req.session.user_id !== undefined) {
    return res.render("urls_new", templateVars);
  }
  res.redirect('/urls/login');
});
// route to urlshortenedURL page to edit
app.post("/urls/:shortURL", (req, res, user_id) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    targetURL: urlDatabase[req.params.shortURL].fullURL,
    user_id: req.session.user_id
  }
  res.render("urls_new", templateVars);
});


app.get("/urls/register", (req, res, user_id) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    targetURL: urlDatabase[req.params.shortURL],
    user_id: req.session.user_id
  }
  res.render("urls_register", templateVars);
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

//for returning the cookie to display back to user
app.post("/urls", (req, res) => { //writes username cookie to server
  let templateVars = {
    user_id: req.session.user_id
  }
  res.session("user_id", req.body.user_id);
  res.render("urls_index", templateVars);
});

// register new user
app.post("/register", (req, res, user_id) => {
  let uEu = req.body.email;
  let uEp = req.body.password;
  let rString = generateRandomString(); // generate random userid
  if (uEu == false || uEp == false) {
    res.send("404 Error. Enter valid user_id & password");
  }
  users[rString] = {
    id: rString,
    email: uEu,
    password: bcrypt.hashSync(uEp, 10)
  };
  req.session.user_id = users[rString].id;

  // res.cookie('email', users[rString].email);
  res.redirect('/urls');
});


app.get("/urls/login", (req, res, user_id) => {
  let templateVars = {};
  res.render("urls_login", templateVars);
});

//new generated link page
app.post("/newLink", (req, res) => {
  let templateVars = {
    longURL: urlDatabase[req.params.longUrl]
  }
  rString = generateRandomString(); // generate random string
  urlDatabase[rString] = {
    fullURL: req.body.longURL,
    userPoster: req.session.user_id
  };
  console.log(urlDatabase);
  res.redirect("/urls");
});

// get a login user_id/password and create a user cookie
app.post("/login", (req, res) => { //recieves cookie and redirects
  let uEu = req.body.email;
  let uEp = req.body.password;
  let founduser = undefined;

  for (id in users) {
    if (uEu === users[id].email && bcrypt.compareSync(uEp, users[id].password) === true) {
      founduser = id;
    }
  }

  if (founduser) {
    req.session.user_id = id;
    res.redirect("/urls");
  } else {
    res.send("user does not exist");
  }


});

//get logout user_id and create a user cookie
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

//returning the cookie to display back to the user
app.post("/urls", (req, res) => {
  let templateVars = {
    user_id: req.session.user_id
  }
  res.session("user_id", req.body.user_id);
  res.render("urls_index", templateVars);
});


//port message on the console
app.listen(PORT, () => {
  console.log(`tiny url app listening on port ${PORT}!`);
});