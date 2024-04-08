const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  if (!req.body.userName || !req.body.password) {
    return res.status(400).json({ message: "UserName and Password are required" });
  }
  var isExist = users.filter(a => a.UserName == req.body.UserName);
  if (isExist.length > 0) {
    return res.status(400).json({ message: "User Already Registered" });
  }
  var user = { userName: req.body.userName, password: req.body.password };
  users.push(user);
  return res.status(200).json({ message: "User Registered" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  var filteredBooks = books[req.params.isbn];
  return res.status(200).json(JSON.stringify(filteredBooks));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  var filteredBooks = Object.values(books).filter(book => book.author === req.params.author);;
  return res.status(200).json(JSON.stringify(filteredBooks));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  var filteredBooks = Object.values(books).filter(book => book.title === req.params.title);
  return res.status(200).json(JSON.stringify(filteredBooks));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  var myBook = books[req.params.isbn].reviews;
  return res.status(200).json(JSON.stringify(myBook));
});

module.exports.general = public_users;
