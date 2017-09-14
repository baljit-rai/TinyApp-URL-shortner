var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port
var ejs = require("ejs");
const bodyParser = require("body-parser");

function generateRandomString() {
  randomString = Math.random().toString(36).substring(2, 8);
  return randomString;
}

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {

      let longURL = urlDatabase[req.params.shortURL];
      console.log(longURL);
      res.redirect(longURL);

      app.post("/urls/:id", (req, res) => {
        let templateVars = {
          urls: urlDatabase,
          shortURL: req.params.id
        };
        res.render("urls_show", templateVars);
      });

      app.post("/urls/:id/update", (req, res) => {
        if (Object.keys(urlDatabase).indexOf(req.params.id) > -1) {
          urlDatabase[req.params.id] = req.body.longURL;
          res.redirect("/urls");
        } else {
          res.redirect("/urls");
        }
      });

      app.post("/urls", (req, result) => {
        let templateVars = {
          longURL: urlDatabase[req.params.shorturl]
        }
        newURL = generateRandomString();
        urlDatabase[newURL] = req.body.longURL;
        var linkName = "YAY!!! you made a tinyURL";
        result.send(rString + ' ' + linkName.link(urlDatabase[newURL]));
      });

      app.post("/urls/:id/delete", (req, result) => {
        delete(urlDatabase[req.params.id]);
        result.redirect("http://localhost:8080/urls/");
      });

      app.post("/urls/:id/update", (req, result) => {
        urlDatabase[req.params.id] = req.body.longURL;
        result.redirect("http://localhost:8080/urls/");
      });

      app.listen(PORT, () => {
        console.log(`Example app listening on: http://localhost:${PORT}!`);
      });