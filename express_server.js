// const express = require("express");
// const app = express();
// const PORT = process.env.PORT || 8080; // default port
// const ejs = require("ejs");
// const bodyParser = require("body-parser");

// function generateRandomString() {
//   randomURL = Math.random().toString(36).substring(2, 8);
//   return randomURL;
// }

// app.use(bodyParser.urlencoded({
//   extended: true
// }));

// app.set('view engine', 'ejs');


// var urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

// app.get("/urls", (req, res) => {
//   let templateVars = {
//     urls: urlDatabase
//   };
//   res.render("urls_index", templateVars);
// });

// app.get("/urls/new", (req, res) => {
//   res.render("urls_new");
// });

// app.get("/u/:shortURL", (req, res) => {
//   let longURL = urlDatabase[req.params.shortURL];
//   console.log(longURL);
//   res.redirect(longURL);
// });

// app.get("/urls/:id", (req, res) => {
//   let templateVars = {
//     urls: urlDatabase,
//     shortURL: req.params.id
//   }
//   res.render("urls_show", templateVars);
// });
// app.post("/urls/:id/update", (req, res) => {
//   if (Object.keys(urlDatabase).indexOf(req.params.id) > -1) {
//     urlDatabase[req.params.id] = req.body.longURL;
//     res.redirect("/urls");
//   } else {
//     res.redirect("/urls");
//   }
// });

// app.post("/urls", (req, result) => {
//   let templateVars = {
//     longURL: urlDatabase[req.params.shorturl]
//   }
//   newURL = generateRandomString();
//   urlDatabase[newURL] = req.body.longURL;
//   var linkName = "YAY!!! you made a tinyURL";
//   result.send(newURL + ' ' + linkName.link(urlDatabase[newURL]));
// });

// app.post("/urls/:id/delete", (req, result) => {
//   delete(urlDatabase[req.params.id]);
//   result.redirect("http://localhost:8080/urls/");
// });

// app.post("/urls/:id/update", (req, result) => {
//   urlDatabase[req.params.id] = req.body.longURL;
//   result.redirect("http://localhost:8080/urls/");
// });

// app.listen(PORT, () => {
//   console.log(`Example app listening on: http://localhost:${PORT}!`);
// });

const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");


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
app.get("/urls", (req, result, username) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies.username
  };
  result.render("urls_index", templateVars);
});
// get request renders new tinyURL maker page
app.get("/urls/new", (req, result, username) => {
  let templateVars = {
    longURL: urlDatabase[req.params.shorturl],
    username: req.cookies.username
  }
  result.render("urls_new", templateVars);
});
// route to urlshortenedURL page to edit
app.post("/urls/:shortURL", (req, result, username) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    targetURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username
  }
  result.render("urls_show", templateVars);
});
app.get("/urls/register", (req, result, username) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    targetURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username
  }
  result.render("urls_register", templateVars);
});
//
// app.post("/urls/:shortURL", (req, result) => {
//     let longURL = urlDatabase[req.params.shortURL];
//     result.redirect(longURL);
// });
//new generated link page
app.post("/urls", (req, result) => {
  let templateVars = {
    longURL: urlDatabase[req.params.shorturl]
  }
  rString = generateRandomString(); // generate random string
  urlDatabase[rString] = req.body.longURL; // redefine string
  // var linkName = "Here's your link!"; // new link generated
  // result.send(rString + ' ' + linkName.link(urlDatabase[rString])); // redirect to new linked page and insert string and new link
  result.redirect("/urls");
});
//   delete object.property
app.post("/urls/:id/delete", (req, result) => {
  console.log('Here!!!!!!');
  delete(urlDatabase[req.params.id]); // delete my object id from the html form
  result.redirect("http://localhost:8080/urls/"); // redirect to main page
});
//   edit the value of the long url to the new input
app.post("/urls/:id/update", (req, result) => {
  urlDatabase[req.params.id] = req.body.longURL;
  result.redirect("http://localhost:8080/urls/"); // redirect to main page
});
//get a login username and create a user cookie
app.post("/login", (req, res) => { //recieves cooking and redirects
  res.cookie('username', req.body.username);
  console.log(req.cookies.username);
  res.redirect("back");
});
//get a logout username and create a user cookie
app.post("/logout", (req, res) => { //recieves cooking and redirects
  res.clearCookie('username');
  res.redirect("back");
});
//for returning the cookie to display back to user
app.post("/urls", (req, res) => { //writes username cookie to server
  let templateVars = {
    username: req.cookies.username
  }
  res.cookie("username", req.body.username);
  res.render("urls_index", templateVars);
});
//port message on the console
app.listen(PORT, () => {
  console.log(`tiny url app listening on port ${PORT}!`);
});