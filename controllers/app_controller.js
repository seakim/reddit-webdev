const mongoose = require("mongoose")
    , axios = require("axios")
    , cheerio = require("cheerio");
const db = require("../models");

mongoose.connect("mongodb://localhost/redditwebdev", { useNewUrlParser: true });

module.exports = (app) => {
    app.get("/scrape", function (req, res) {
        axios.get("https://old.reddit.com/r/webdev/").then(response => {
            const $ = cheerio.load(response.data);
    
            /** STORY */
            $("div.thing").each( (i, element) => {
                const result = {};
                result.title = $(element).children(".entry.unvoted").children(".top-matter").children(".title").children(".title.may-blank").text();
                result.submittedBy = $(element).children(".entry.unvoted").children(".top-matter").children(".tagline").text();
                result.link = "https://old.reddit.com" + $(element).children(".entry.unvoted").children(".top-matter").children(".title").children(".title.may-blank").attr("href");
                result.numComment = $(element).children(".entry.unvoted").children(".top-matter").children(".flat-list.buttons").children(".first").children().text().split(" ")[0];
                result.rank = $(element).find(".rank").text();
                result.score = $(element).children(".midcol.unvoted").children(".score.unvoted").text();
                if (result.numComment === "comment") {
                    result.numComment = "0";
                }
                // console.log(stories);
                db.Article.create(result)
                    .then(dbArticle => console.log(dbArticle))
                    .catch(err => res.json(err))
            })
        });
        res.send("Scrape Complete");
    })
    
    app.get("/articles", function (req, res) {
        db.Article.find()
            .then( dbArticle => res.json(dbArticle) )
            .catch( err => console.log(err) )
    });
    
    app.get("/articles/:id", (req, res) => {
        let id = req.params.id;
        db.Article.findOne({_id: id}) // db.Article.findById(id)
            .populate("notes")
            .then( dbArticle =>  res.json(dbArticle) )
            .catch( err => console.log(err) )
    });
    
    app.post("/articles/:id", (req, res) => {    
        let creation = req.body;
        creation.article = req.params.id;
        console.log(creation)
        db.Note.create(creation).then( note => {
            var noteId = note._id;
            db.Article.findOneAndUpdate(
                { _id: req.params.id },
                { $push: {notes: noteId} }
            )
            .then( Article => res.json(Article) )
            .catch( err => console.log(err) )
        })
        .catch( err => console.log(err) )
    });

    app.get("/notes", (req, res) => {
        db.Note.find()
            .then( dbNote => res.json(dbNote) )
            .catch( err => console.log(err) )
    })

    app.get("/notes/:id", (req, res) => {
        let id = req.params.id;
        db.Note.findOne( {_id: id} )
            .then( dbNote => res.json(dbNote) )
            .catch( err => console.log(err) )
    })

    app.delete("/notes/:noteId/articles/:articleId", (req, res) => {
        let noteId = req.params.noteId;
        let articleId = req.params.articleId;

        db.Article.findOneAndUpdate(
            { _id: articleId },
            { $pull: {notes: noteId} }
        )
        .then( () => {
            db.Note.deleteOne( {_id: noteId})
                .then( dbNote => res.json(dbNote) )
                .catch( err => console.log(err) )
        })
        .catch( err => console.log(err) )
    })
}
