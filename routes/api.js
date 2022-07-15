/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
// Connect to MongoDB (Database name: "personalLibraryProjectDB")
const mongoose = require("mongoose");
mongoose
  .connect(process.env["MONGO_URI"], { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Could not connect to database", err));

const bookSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  comments: [String],
  commentcount: { type: Number, default: 0 }
});
const Book = mongoose.model("Book", bookSchema, "books");


module.exports = function (app) {
  
  app.route('/api/books')

    // get all books
    .get(function (req, res){
      console.log("\/\/---------- BOOKS GET --------//")
      Book.find({}, (err, books) => {
        if(err) return console.error(err);
        return printBooks(books, res);
      });
    })

    // create new book
    .post(function (req, res){
      console.log("\/\/---------- BOOKS POST (NEW BOOK) --------//")
      const title = req.body.title;
      if(!title) return printErrorMissingRequiredFieldTitle(res);
      const newBook = new Book({ title: title });
      newBook.save((err, book) => {
        if(err) return console.error(err);
        return printNewBook(book, res);
      });
    })

    // delete all books
    .delete(function(req, res){
      console.log("\/\/---------- BOOKS DELETE --------//")
      Book.deleteMany({}, (err, aknowledge) => {
        if(err) return console.error(err);
        return printCompleteDeleteSuccessful(res);
      });
    });



  app.route('/api/books/:id')

    // get book by id
    .get(function (req, res){
      console.log("\/\/---------- BOOK GET --------//")
      const bookid = req.params.id;
      Book.findOne({ _id: bookid }, (err, book) => {
        if(err) return console.error(err);
        if(!book) return printErrorNoBookExists(res);
        return printBook(book, res);
      });
    })

    // create new comment in a book by id
    .post(function(req, res){
      console.log("\/\/------- BOOK POST (NEW COMMENT) --------//")
      const bookid = req.params.id;
      const comment = req.body.comment;
      //-------- NÃO SEI SE  VAI RESULTAR!!!!!
      if(!bookid) return printErrorMissingRequiredFieldTitle(res);
      //--------------------------------------
      if(!comment) return printErrorMissingRequiredFieldComment(res);
      Book.findOne({ _id: bookid }, (err, book) => {
        if(err) return console.error(err);
        if(!book) return printErrorNoBookExists(res);
        book.comments.push(comment);
        book.commentcount = book.comments.length;
        book.save((err, savedBook) => {
          if(err) return console.error(err);
          return printNewComment(savedBook, res);
        });
      });
      
    })

    // delete book by id
    .delete(function(req, res){
      console.log("\/\/---------- BOOK DELETE --------//")
      const bookid = req.params.id;
      Book.deleteOne({ _id: bookid }, (err, aknowledge) => {
        if(err) return console.error(err);
        if(aknowledge.deletedCount === 0) return printErrorNoBookExists(res);
        if(aknowledge.deletedCount === 1) return printDeleteSuccessful(res);
      });
    });
  
};



//------------- AUXILIARY FUNCTIONS -----------//
// error (res.send)
function printErrorMissingRequiredFieldTitle(res) {
  const error = "missing required field title";
  console.log(error);
  return res.send(error);
}
function printErrorMissingRequiredFieldComment(res) {
  const error = "missing required field comment";
  console.log(error);
  return res.send(error);
}
function printErrorNoBookExists(res) {
  const error = "no book exists";
  console.log(error);
  return res.send(error);
}

// delete (res.send)
function printDeleteSuccessful(res) {
  const message = "delete successful";
  console.log(message);
  return res.send(message);
}
function printCompleteDeleteSuccessful(res) {
  const message = "complete delete successful";
  console.log(message);
  return res.send(message);
}

// post (res.json)
function printNewBook(book = {}, res) {
  const successObj = { _id: book._id.toString(), title: book.title };
  console.log(successObj);
  return res.json(successObj);
}
function printNewComment(book = {}, res) {
  const successObj = { _id: book._id, title: book.title, comments: book.comments };
  console.log(successObj);
  return res.json(successObj);
}

// get (res.json)
function printBooks(books = [], res) {
  const messageObj = books.map((d) => { return { _id: d._id.toString(), title: d.title, commentcount: d.comments.length } });
  //console.log(messageObj);
  return res.json(messageObj);
}
function printBook(book = {}, res) {
  const messageObj = { _id: book._id.toString(), title: book.title, comments: book.comments };
  console.log(messageObj);
  return res.json(messageObj);
}
