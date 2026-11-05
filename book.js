// CRUD operations for books table in book_store database
/*
1. Initialize PROJECT
   > npm init -y
   This will create package.json

2. Install dependencies
   > npm install express mysql
   (or: npm install express mysql2)

Execution: Run server
   > node app.js
Then open: http://localhost:3000/
*/

const express = require("express");
const mysql = require("mysql8");   // ✅ use mysql or mysql2
const app = express();
app.use(express.json());

// Read HTML files from frontend folder
app.use(express.static("frontened"));  // ✅ folder name must match

// Connection establishment with book_store database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Divya@93903",   // replace with your MySQL password
    database: "book_store"
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

// ✅ GET all books
app.get("/books", (req, res) => {
    db.query("SELECT * FROM book", (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// ✅ GET one book by ID
app.get("/books/:id", (req, res) => {
    db.query(
        "SELECT * FROM book WHERE book_id = ?",
        [req.params.id],
        (err, result) => {
            if (err) throw err;
            res.json(result);
        }
    );
});

// ✅ INSERT new book
app.post("/books", (req, res) => {
    const { book_id, book_title, book_author, book_category, book_price, book_stock } = req.body;
    db.query(
        "INSERT INTO book (book_id, book_title, book_author, book_category, book_price, book_stock) VALUES (?, ?, ?, ?, ?, ?)",
        [book_id, book_title, book_author, book_category, book_price, book_stock],
        err => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            res.send("Book Inserted");
        }
    );
});

// ✅ UPDATE book
app.put("/books/:id", (req, res) => {
    const { book_title, book_author, book_category, book_price, book_stock } = req.body;
    db.query(
        "UPDATE book SET book_title = ?, book_author = ?, book_category = ?, book_price = ?, book_stock = ? WHERE book_id = ?",
        [book_title, book_author, book_category, book_price, book_stock, req.params.id],
        (err, result) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            if (result.affectedRows === 0) {
                res.status(404).send("Book NOT found");
            } else {
                res.send("Book Updated");
            }
        }
    );
});

// ✅ DELETE book
app.delete("/books/:id", (req, res) => {
    db.query(
        "DELETE FROM book WHERE book_id = ?",
        [req.params.id],
        (err, result) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            if (result.affectedRows === 0) {
                res.status(404).send("Book NOT found to delete");
            } else {
                res.send("Book Deleted");
            }
        }
    );
});

// ✅ Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
