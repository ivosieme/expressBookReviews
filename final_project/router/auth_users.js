const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    return true;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the provided credentials match the records
    if (authenticatedUser(username, password)) {
        // If authenticated, generate JWT token
        const accessToken = jwt.sign({ username: username }, "secret_key");
        
        req.session.authorization = {
            accessToken,username
        }
        
        return res.status(200).json({ accessToken: accessToken });
    } else {
        // If not authenticated, send unauthorized response
        return res.status(401).json({ message: "Unauthorized" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username; // Assuming username is stored in the session
    const review = req.query.review;

    // Check if the book with the provided ISBN exists
    if (!books.hasOwnProperty(isbn)) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already reviewed the book
    if (books[isbn].reviews.hasOwnProperty(username)) {
        // If the user has already reviewed the book, modify the existing review
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review modified successfully" });
    } else {
        // If the user has not reviewed the book, add a new review
        books[isbn].reviews[username] = review;
        return res.status(201).json({ message: "Review added successfully" });
    }
});

// Delete a book review (authenticated route)
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username; // Assuming username is stored in the session

    // Check if the book with the provided ISBN exists
    if (!books.hasOwnProperty(isbn)) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has reviewed the book
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for the provided ISBN" });
    }

    // Delete the review
    delete books[isbn].reviews[username];
    
    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
