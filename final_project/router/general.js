const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required", body : req.body  });
    }

    // Check if the username already exists
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists"});
    }

    // Add the new user to the users array
    users.push({ username: username, password: password });

    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const bookList = Object.values(books);

  return res.status(200).json(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  // Extract ISBN from request parameters
  const isbn = req.params.isbn;

  // Check if the book with the provided ISBN exists
  if (books.hasOwnProperty(isbn)) {
      // If the book exists, return its details
      const bookDetails = books[isbn];
      return res.status(200).json(bookDetails);
  } else {
      // If the book does not exist, return 404 Not Found
      return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // Extract author from request parameters
  const author = req.params.author;

  // Array to store books by the provided author
  const booksByAuthor = [];

  // Iterate through the books object
  Object.keys(books).forEach(isbn => {
      const book = books[isbn];
      // Check if the author of the current book matches the provided author
      if (book.author === author) {
          booksByAuthor.push(book);
      }
  });

  // Check if any books by the provided author were found
  if (booksByAuthor.length > 0) {
      // If books are found, return them as JSON response
      return res.status(200).json(booksByAuthor);
  } else {
      // If no books are found, return 404 Not Found
      return res.status(404).json({ message: "No books found for the provided author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // Extract title from request parameters
  const title = req.params.title;

  // Array to store books with the provided title
  const booksWithTitle = [];

  // Iterate through the books object
  Object.keys(books).forEach(isbn => {
      const book = books[isbn];
      // Check if the title of the current book matches the provided title
      if (book.title === title) {
          booksWithTitle.push(book);
      }
  });

  // Check if any books with the provided title were found
  if (booksWithTitle.length > 0) {
      // If books are found, return them as JSON response
      return res.status(200).json(booksWithTitle);
  } else {
      // If no books are found, return 404 Not Found
      return res.status(404).json({ message: "No books found for the provided title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  // Extract ISBN from request parameters
  const isbn = req.params.isbn;

  // Check if the book with the provided ISBN exists
  if (books.hasOwnProperty(isbn)) {
      // If the book exists, retrieve its reviews
      const bookReviews = books[isbn].reviews;
      return res.status(200).json(bookReviews);
  } else {
      // If the book does not exist, return 404 Not Found
      return res.status(404).json({ message: "Book not found" });
  }
});

/**
 * AXIS ASYNC Call based on Task 10 to Task 14 start here
 */

public_users.get('/axios/',async function (req, res) {
    try {
        // Make a GET request to fetch the list of books
        const response = await axios.get('http://localhost/');

        // Extract the list of books from the response data
        const books = response.data;

        // Return the list of books as JSON response
        res.json(books);
    } catch (error) {
        // If an error occurs during the request, return an error response
        res.status(500).json({ message: "Internal Server Error" });
    }
});

public_users.get('/axios/isbn/:isbn',async function (req, res) {
    // Extract ISBN from request parameters
    const isbn = req.params.isbn;
    try {
        // Make a GET request to fetch the list of books
        const response = await axios.get('http://localhost/isbn/' + isbn);

        // Extract the list of books from the response data
        const books = response.data;

        // Return the list of books as JSON response
        res.json(books);
    } catch (error) {
        // If an error occurs during the request, return an error response
        res.status(500).json({ message: "Internal Server Error" });
    }
});

public_users.get('/axios/author/:author',async function (req, res) {
    // Extract Author from request parameters
    const author = req.params.author;
    try {
        // Make a GET request to fetch the list of books
        const response = await axios.get('http://localhost/author/' + author);

        // Extract the list of books from the response data
        const books = response.data;

        // Return the list of books as JSON response
        res.json(books);
    } catch (error) {
        // If an error occurs during the request, return an error response
        res.status(500).json({ message: "Internal Server Error" });
    }
});

public_users.get('/axios/title/:title',async function (req, res) {
    // Extract Author from request parameters
    const title = req.params.title;
    try {
        // Make a GET request to fetch the list of books
        const response = await axios.get('http://localhost/title/' + title);

        // Extract the list of books from the response data
        const books = response.data;

        // Return the list of books as JSON response
        res.json(books);
    } catch (error) {
        // If an error occurs during the request, return an error response
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports.general = public_users;
