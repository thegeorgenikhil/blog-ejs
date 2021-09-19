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

mongoose.connect("mongodb://localhost:27017/blogDB")

const postSchema = new mongoose.Schema({
    img: String,
    title: String,
    content: String,
    popularPost: Boolean
})

const Post = mongoose.model("Post", postSchema)

// const posts = [{
//         img: "https://picsum.photos/id/1025/600/400",
//         title: "Introduction To MongoDB",
//         content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//         popularPost: true
//     },
//     {
//         img: "https://picsum.photos/id/1025/600/400",
//         title: "Semantic HTML",
//         content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//         popularPost: false
//     }, {
//         img: "https://picsum.photos/id/1025/600/400",
//         title: "Intro to CSS",
//         content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//         popularPost: false
//     }, {
//         img: "https://picsum.photos/id/1025/600/400",
//         title: "Data Structures and Algorithms",
//         content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//         popularPost: false
//     },
//     {
//         img: "https://picsum.photos/id/1025/600/400",
//         title: "Computer Science Fundamentals",
//         content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//         popularPost: false
//     }, {
//         img: "https://picsum.photos/id/1025/600/400",
//         title: "Intro to React Native",
//         content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//         popularPost: false
//     }
// ];

const post1 = new Post({
    img: "https://picsum.photos/id/1025/600/400",
    title: "Intro to React Native",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    popularPost: true
})

const post2 = new Post({
    img: "https://picsum.photos/id/1025/600/400",
    title: "Computer Science Fundamentals",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    popularPost: false
})

// post1.save()
// post2.save()

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


    sampleFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);
        const post = new Post({
            img: "/upload/" + sampleFileName,
            title: postTitle,
            content: postContent,
            popularPost: false
        });
        post.save()
        res.redirect("/")


    });
});

app.post("/popular", (req, res) => {
    let selectedPost = req.body.select;
    Post.find({}, (err, posts) => {
        if (!err) {
            posts.forEach(post => {
                if (_.lowerCase(post.title) === _.lowerCase(selectedPost)) {
                    Post.findOneAndUpdate({_id: post._id}, {popularPost: true}, (err,docs) =>{
                        return
                    })
                }else{
                    Post.findOneAndUpdate({_id: post._id}, {popularPost: false}, (err,docs) =>{
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