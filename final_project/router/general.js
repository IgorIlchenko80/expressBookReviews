const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  const bookPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(JSON.stringify(books,null,4))
    },1000)});

  bookPromise.then((bookList) => {
    res.send(bookList);
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const bookPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(JSON.stringify(books[isbn],null,4))
    },1000)});

  bookPromise.then((book) => {
    res.send(book);
  });

});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorParam = req.params.author;

  const bookPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      const matchingBooks = [];
      const isbns = Object.keys(books);

      for (let isbn of isbns) {
         const book = books[isbn];
         if (book.author === authorParam) {
            matchingBooks.push({ isbn, ...book });
         }
      }
      resolve(JSON.stringify(matchingBooks,null,4))
    },1000)});

  bookPromise.then((book) => {
    res.send(book);
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleParam = req.params.title;

  const bookPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      const matchingBooks = [];
      const isbns = Object.keys(books);

      for (let isbn of isbns) {
         const book = books[isbn];
         if (book.title === titleParam) {
            matchingBooks.push({ isbn, ...book });
         }
      }
      resolve(JSON.stringify(matchingBooks,null,4))
    },1000)});

  bookPromise.then((book) => {
    res.send(book);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
