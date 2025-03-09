const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const { username, password } = req.body; // Extract username and password from request body

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users[username] = { password: password };
  return res.status(201).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   return res.status(200).json({books})
// });

public_users.get('/', async function (req, res) {
    try {
      const response = await axios.get("http://localhost:5000/booksdb");
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  });

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//     const isbn = req.params.isbn;
//   const book = books[isbn];
  
//   if (!book) {
//     return res.status(404).json({ message: "Book not found." });
//   }
  
//   return res.status(200).json(book);
//  });

public_users.get('/isbn/:isbn', async (req, res) => {
    const { isbn } = req.params;
    try {
        const response = await axios.get(`https://api.example.com/books/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details" });
    }
});

  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//     const author = req.params.author;
//   const booksByAuthor = Object.values(books)
//   .filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
  
//   if (booksByAuthor.length === 0) {
//     return res.status(404).json({ message: "No books found by this author." });
//   }

//   return res.status(200).json({booksByAuthor});
// });

public_users.get('/author/:author', async (req, res) => {
    const { author } = req.params;
    try {
        const response = await axios.get(`https://api.example.com/books?author=${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details" });
    }
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//     const title = req.params.title;
//     const booksByTitle = Object.values(books)
//     .filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
  
//     if (booksByTitle.length === 0) {
//       return res.status(404).json({ message: "No books found with this title." });
//     }
  
//     return res.status(200).json({booksByTitle});
// });

public_users.get('/title/:title', async (req, res) => {
    const { title } = req.params;
    try {
        const response = await axios.get(`https://api.example.com/books?title=${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
