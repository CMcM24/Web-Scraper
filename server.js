var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/webscraperdb", { useNewUrlParser: true });


// mongoose.connect("mongodb://localhost/webscraperdb", { useNewUrlParser: true });


app.get("/scrape", function (req, res) {
    axios.get("https://www.space.com/news").then(function (response) {
        var $ = cheerio.load(response.data);

        $("div.listingResult").each(function (i, element) {
            var newEntry = {};

            newEntry.title = $(this).find("article").find("div.content").find("header").find("h3").text();
            newEntry.link = $(this).find("a").attr("href");
            newEntry.image = $(this).find("div.image").find("img").attr("data-src");
            newEntry.saved = false;
            newEntry.comment;

            db.Entry.create(newEntry).then(function (dbEntry) {
                console.log(dbEntry);
            }).catch(function (err) {
                console.log(err);
            });
        });

        console.log("scrape complete");
    });
});



app.get("/entries", function (req, res) {
    db.Entry.find({}).then(function (dbEntry) {
        res.json(dbEntry);
    }).catch(function (err) {
        res.json(err);
    });
});


app.get("/entries/:id", function (req, res) {
    db.Entry.findOne({ _id: req.params.id }).populate("comment")
        .then(function (dbEnrty) {
            res.json(dbEnrty);
        }).catch(function (err) {
            res.json(err);
        });
});



app.post("/entries/:id", function (req, res) {
    db.Comment.create(req.body)
        .then(function (dbComment) {
            return db.Entry.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
        }).then(function (dbEntry) {
            res.json(dbEntry);
        }).catch(function (err) {
            res.json(err);
        });
});

app.put("/entries/:id", function (req, res) {

    var id = req.params.id;

    db.Entry.findOne(
        { _id: id },
        // { upsert: true, multi: false }
    ).then(function (dbEntry) {

        db.Entry.updateOne(
            { _id: id },
            { $set: { saved: !dbEntry.saved } }
        ).then(function (result) {
            console.log(result);
            res.json(result);
        });
        res.json(dbEntry);
    }).catch(function (err) {
        res.json(err);
    });
});




app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});