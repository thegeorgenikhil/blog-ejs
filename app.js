const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const _ = require("lodash")
const mongoose = require("mongoose");
const {
    ObjectId
} = require("mongodb");
const { trim } = require("lodash");


const app = express();

app.use(fileUpload());
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("view engine", "ejs")

mongoose.connect("")

const postSchema = new mongoose.Schema({
    img: String,
    title: String,
    content: String,
    popularPost: Boolean
})

const Post = mongoose.model("Post", postSchema)

app.get("/", (req, res) => {
    Post.find({}, (err, posts) => {
        if (!err) {
            res.render("index", {
                posts: posts
            })
        }
    })
})

app.get("/post/:postTitle", (req, res) => {
    const postTitle = req.params.postTitle;
    Post.find({}, (err, posts) => {
        if (!err) {
            console.log(posts)
            posts.forEach(post => {
                if (trim(postTitle) === trim(post.title)) {
                    console.log(post)
                    res.render("post", {
                        post: post
                    })
                }
            });
        } else {
            console.log(err)
        }
    })

})

app.get("/compose", (req, res) => {
    res.render("compose")
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/popular", (req, res) => {
    Post.find({}, (err, posts) => {
        if (!err) {
            res.render("popular", {
                posts: posts
            })
        }
    })
})


app.post('/compose', (req, res) => {
    let sampleFile;
    let uploadPath;

    const postTitle = req.body.postTitle;
    const postContent = req.body.postContent
    sampleFile = req.files.imgFile;
    const sampleFileName = sampleFile.name
    uploadPath = __dirname + "/public/upload/" + sampleFileName;


    sampleFile.mv(uploadPath, async function (err) {
        if (err)
            return res.status(500).send(err);
        const post = new Post({
            img: "/upload/" + sampleFileName,
            title: postTitle,
            content: postContent,
            popularPost: false
        });
        await post.save()
        res.redirect("/")


    });
});

app.post("/popular", (req, res) => {
    let selectedPost = req.body.select;
    Post.find({}, (err, posts) => {
        if (!err) {
            posts.forEach(async (post) => {
                if (_.lowerCase(post.title) === _.lowerCase(selectedPost)) {
                    await Post.findOneAndUpdate({_id: post._id}, {popularPost: true}, (err,docs) =>{
                        return
                    })
                }else{
                    await Post.findOneAndUpdate({_id: post._id}, {popularPost: false}, (err,docs) =>{
                        return
                    })
                }
            })
        }
    })

    res.redirect("/")
})

app.listen(3000, () => {
    console.log("Server started at port 3000")
})
