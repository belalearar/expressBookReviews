const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  if (!req.body.userName || !req.body.password) {
    return res.status(400).json({ message: "UserName and Password are required" });
  }
  var validUser = Object.values(users).filter(user => user.userName == req.body.userName && user.password == req.body.password);
  if (validUser.length == 0) {
    return res.status(400).json({ message: "Invalid Username Or Password" });
  }
  const payload = {
    userName: req.body.userName
  }
  var login = jwt.sign(payload, "fingerprint_customer", { expiresIn: '1h' });
  return res.status(200).json({ token: login });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  var login = jwt.verify(req.headers.authorization.split(' ')[1], "fingerprint_customer");
  var book = books[req.params.isbn];
  var bookReviews = book.reviews;


  let index = bookReviews.findIndex(user => user.userName === login.userName);
  if (index == -1) {
    return res.status(400).json({ message: "bad request" });
  }
  bookReviews.splice(index, 1);
  return res.status(200).json({ message: "review Deleted" });

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  var login = jwt.verify(req.headers.authorization.split(' ')[1], "fingerprint_customer");
  if (!login.userName) {
    return res.status(400).json({ message: "bad request" });

  }
  var book = books[req.params.isbn];
  var bookReviews = book.reviews;

  var userReview = bookReviews.filter(a => a.userName == login.userName);
  if (userReview.length == 0) {
    bookReviews.push({ userName: login.userName, rate: req.query.review });
    book.reviews = bookReviews;
    return res.status(200).json({ message: "review Added" });
  }
  else {
    let index = bookReviews.findIndex(user => user.userName === login.userName);
    bookReviews[index].rate = req.query.review;
    return res.status(200).json({ message: "review Updated" });

  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
