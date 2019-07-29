var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = app => {
  // A GET route for scraping the echoJS website
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    // axios.get("https://www.bbc.com/news/world/us_and_canada").then(function (response) {
    //   // Then, we load that into cheerio and save it to $ for a shorthand selector
    //   var $ = cheerio.load(response.data);

    //   // Now, we grab every h2 within an article tag, and do the following:
    //   $("article").each(function (i, element) {
    //     // Save an empty result object
    //     var result = {};

    //     // Add the text and href of every link, and save them as properties of the result object
    //     result.link = $(this)
    //       .children("header")
    //       .children("div")
    //       .children("h3")
    //       .children("a")
    //       .attr("href");
    //     result.title = $(this)
    //       .children("header")
    //       .children("div")
    //       .children("h3")
    //       .children("a")
    //       .children("span")
    //       .text();
    //     result.summary = $(this)
    //       .children("div")
    //       .children("div")
    //       .children("div")
    //       .children("div")
    //       .children("div")
    //       .children("p")
    //       .text();

        axios.get("https://www.bbc.com/news/world/us_and_canada").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $("article").each(function (i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.link = $(this)
          .children("header")
          .children("div")
          .children("h3")
          .children("a")
          .attr("href");
        result.title = $(this)
          .children("header")
          .children("div")
          .children("h3")
          .children("a")
          .children("span")
          .text();
        result.summary = $(this)
          .children("div")
          .children("div")
          .children("div")
          .children("div")
          .children("div")
          .children("p")
          .text();

        
          //dupe check ?

        db.Article.find({}).then(dbResult => {

          if (dbResult.length === 0){
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
              .then(function (dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
              })
              .catch(function (err) {
                // If an error occurred, log it
                console.log(err);
              });
          } else {
            db.Article.update(result).then(dbResult => {
              console.log(dbResult, "update function");
            }).catch(err => {
              console.log(err);
            })
          }
        })

      });

      // Send a message to the client
      res.redirect("/");
    });
  });

  // Route for getting all Articles from the db
  app.get("/api/articles", function (req, res) {
    console.log("what it be yo!!? apiRoutes.js in routes folder");
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        articleObject = {
          data: dbArticle
        }
        res.send(articleObject);
        // res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function (dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function (dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function (dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.get("/comment", (req, res) => {
    console.log("comment seciont")
    res.send("cherry");
  })

  app.get("/clear", (req, res) => {
    console.log("clear route");
    db.Article.collection.drop();
    res.redirect("/");
  });
}



