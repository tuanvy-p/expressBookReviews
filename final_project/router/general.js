const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Kiểm tra xem đã truyền đủ username và password chưa
  if (!username || !password) {
    return res.status(404).json({ message: "Unable to register user. Username and/or password not provided." });
  }

  // Kiểm tra xem username đã tồn tại chưa
  if (isValid(username)) {
    users.push({ "username": username, "password": password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
  } else {
    return res.status(404).json({ message: "User already exists!" });
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  try {
    // Giả lập xử lý bất đồng bộ qua Promise
    const getBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };

    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
const isbn = req.params.isbn;

  try {
    const getBookByISBN = (isbnNum) => {
      return new Promise((resolve, reject) => {
        if (books[isbnNum]) {
          resolve(books[isbnNum]);
        } else {
          reject("Book not found");
        }
      });
    };

    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
const author = req.params.author;

  try {
    const getBooksByAuthor = (authorName) => {
      return new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const matchingBooks = [];

        bookKeys.forEach((key) => {
          if (books[key].author.toLowerCase() === authorName.toLowerCase()) {
            matchingBooks.push(books[key]);
          }
        });

        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found by this author");
        }
      });
    };

    const matchingBooks = await getBooksByAuthor(author);
    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(404).json({ message: error });
  } 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
const title = req.params.title;

  try {
    const getBooksByTitle = (titleName) => {
      return new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const matchingBooks = [];

        bookKeys.forEach((key) => {
          if (books[key].title.toLowerCase() === titleName.toLowerCase()) {
            matchingBooks.push(books[key]);
          }
        });

        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found with this title");
        }
      });
    };

    const matchingBooks = await getBooksByTitle(title);
    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
