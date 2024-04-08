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
  fetchBooks() 
    .then(books => {
      res.status(200).json(books);
    })
    .catch(error => {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  fetchBookByISBN(req.params.isbn)
    .then(book => {
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    })
    .catch(error => {
      console.error('Error fetching book:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  new Promise((resolve, reject) => {
    setTimeout(() => {
      var filteredBooks = Object.values(books).filter(book => book.author === req.params.author);
      resolve(filteredBooks);
    }, 1000);
  })
  .then(filteredBooks => {
    res.status(200).json(filteredBooks);
  })
  .catch(error => {
    console.error('Error fetching books by author:', error);
    res.status(500).json({ error: 'Internal server error' });
  });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  new Promise((resolve, reject) => {
    setTimeout(() => {
      var filteredBooks = Object.values(books).filter(book => book.title === req.params.title);
      resolve(filteredBooks);
    }, 1000);
  })
  .then(filteredBooks => {
    res.status(200).json(filteredBooks);
  })
  .catch(error => {
    console.error('Error fetching books by author:', error);
    res.status(500).json({ error: 'Internal server error' });
  });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  var myBook = books[req.params.isbn].reviews;
  return res.status(200).json(JSON.stringify(myBook));
});

function fetchBooks() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);

      reject(new Error("Failed to fetch books"));
    }, 1000);
  });
}

function fetchBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books[isbn]);
      reject(new Error("Failed to fetch book by ISBN"));
    }, 1000);
  });
}

module.exports.general = public_users;
