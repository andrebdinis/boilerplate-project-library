/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /*test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        if(err) return console.error(err);
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });*/
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('#1 Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .post("/api/books")
          .type("form")
          .send({ title: "ICO: Castle In The Mist" })
          .end((err, res) => {
            if(err) return console.error(err);
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.property(res.body, "_id", "response object should contain property _id");
            assert.property(res.body, "title", "response object should contain property title");
            done();
          });
      });
      
      test('#2 Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post("/api/books")
          .type("form")
          .send({})
          .end((err, res) => {
            if(err) return console.error(err);
            assert.equal(res.status, 200);
            assert.isEmpty(res.body, "response body should be an empty object");
            assert.equal(res.text, "missing required field title", "response text should have an error message");
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('#3 Test GET /api/books',  function(done){
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            if(err) return console.error(err);
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response body should be a books array");
            assert.isAtLeast(res.body.length, 1, "books array length should be at least one item")
            assert.isObject(res.body[0], "books array should have at least one book object");
            assert.property(res.body[0], "_id", "book object should have a property _id");
            assert.property(res.body[0], "title", "book object should have a property title");
            assert.property(res.body[0], "commentcount", "book object should have a property commentcount");
            done();
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('#4 Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .get("/api/books/62d1318b22836294f19cbef1")
          .end((err, res) => {
            if(err) return console.error(err);
            assert.equal(res.status, 200);
            assert.isEmpty(res.body, "response body should be an empty object");
            assert.equal(res.text, "no book exists", "response text should be an error message");
            done();
          });
      });
      
      test('#5 Test GET /api/books/[id] with valid id in db',  function(done){

        //get last book object _id from books array
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            if(err) return console.error(err);
            assert.equal(res.status, 200);

            const id = res.body.at(-1)._id.toString();

            // get last book by id to verify that it exist
            chai
              .request(server)
              .get("/api/books/" + id)
              .end((err, res) => {
                if(err) return console.error(err);
                assert.equal(res.status, 200);
                assert.isObject(res.body, "response body should be an object");
                assert.property(res.body, "_id", "book object should have a property _id");
                assert.equal(res.body._id.toString(), id, "book object should have the same _id as the searched id");
                assert.property(res.body, "title", "book object should have a property title");
                assert.property(res.body, "comments", "book object should have a property comments");
                assert.isArray(res.body.comments, "book object should have a property comments which is an array");
                done();
              });
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('#6 Test POST /api/books/[id] with comment', function(done){
        
        //get last book object _id from books array
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            if(err) return console.error(err);
            assert.equal(res.status, 200);

            const id = res.body.at(-1)._id.toString();

            // create a new comment on the last book by id
            chai
              .request(server)
              .post("/api/books/" + id)
              .type("form")
              .send({ _id: id, comment: "This novelisation of the videogame ICO was greatly appreciated by the media and public in general." })
              .end((err, res) => {
                if(err) return console.error(err);
                assert.equal(res.status, 200);
                assert.isObject(res.body, "response body should be an object");
                assert.property(res.body, "_id", "book object should have a property _id");
                assert.equal(res.body._id.toString(), id, "book object should have the same _id as the searched id");
                assert.property(res.body, "title", "book object should have a property title");
                assert.property(res.body, "comments", "book object should have a property comments");
                assert.isArray(res.body.comments, "book object should have a property comments which is an array");
                assert.equal(res.body.comments.at(-1), "This novelisation of the videogame ICO was greatly appreciated by the media and public in general.", "book object's comments array should have as the last item a string equal as the comment it was posted before.")
                done();
              });
          });
      });

      test('#7 Test POST /api/books/[id] without comment field', function(done){
        //get last book object _id from books array
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            if(err) return console.error(err);
            assert.equal(res.status, 200);

            const id = res.body.at(-1)._id.toString();

            // try to create a new comment without the comment field included, on the last book by id
            chai
              .request(server)
              .post("/api/books/" + id)
              .type("form")
              .send({ _id: id })
              .end((err, res) => {
                if(err) return console.error(err);
                assert.equal(res.status, 200);
                assert.isEmpty(res.body, "response body should be an empty object");
                assert.equal(res.text, "missing required field comment", "response text should be an error message");
                done();
              });
          });
      });

      test('#8 Test POST /api/books/[id] with comment, id not in db', function(done){
        const invalidId = "12d146344d19d87415e769f2";
        // try to create a new comment on a book with an invalid id
        chai
          .request(server)
          .post("/api/books/" + invalidId)
          .type("form")
          .send({ _id: invalidId, comment: "Interesting, but not that much. Not really." })
          .end((err, res) => {
            if(err) return console.error(err);
            assert.equal(res.status, 200);
            assert.isEmpty(res.body, "response body should be an empty object");
            assert.equal(res.text, "no book exists", "response text should be an error message");
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('#9 Test DELETE /api/books/[id] with valid id in db', function(done){

        // post a new book and get its _id
        chai
          .request(server)
          .post("/api/books")
          .type("form")
          .send({ title: "The Book To Be Deleted" })
          .end((err, res) => {
            if(err) return console.error(err);
            assert.equal(res.status, 200);

            const id = res.body._id.toString();

            // try to delete the (last) new book by id
            chai
              .request(server)
              .delete("/api/books/" + id)
              .type("form")
              .send({ _id: id })
              .end((err, res) => {
                if(err) return console.error(err);
                assert.equal(res.status, 200);
                assert.isEmpty(res.body, "response body should be an empty object");
                assert.equal(res.text, "delete successful", "response text should be a success message");
                done();
              });
          });
      });

      test('#10 Test DELETE /api/books/[id] with id not in db', function(done){
        const invalidId = "12d126344d14d87415e769f2";
        // try to delete a book with invalid id
        chai
          .request(server)
          .delete("/api/books/" + invalidId)
          .type("form")
          .send({ _id: invalidId })
          .end((err, res) => {
            if(err) return console.error(err);
            assert.equal(res.status, 200);
            assert.isEmpty(res.body, "response body should be an empty object");
            assert.equal(res.text, "no book exists", "response text should be an error message");
            done();
          });
      });

    });

  });

});
