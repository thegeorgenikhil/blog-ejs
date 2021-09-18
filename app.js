const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');


const app = express();

app.use(fileUpload());
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("view engine", "ejs")

const posts = [{
        img: "https://picsum.photos/id/1025/600/400",
        title: "Introduction To MongoDB",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        popularPost: true
    },
    {
        img: "https://picsum.photos/id/1025/600/400",
        title: "Semantic HTML",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        popularPost: false
    }, {
        img: "https://picsum.photos/id/1025/600/400",
        title: "Intro to CSS",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        popularPost: false
    }, {
        img: "https://picsum.photos/id/1025/600/400",
        title: "Data Structures and Algorithms",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        popularPost: false
    },
    {
        img: "https://picsum.photos/id/1025/600/400",
        title: "Computer Science Fundamentals",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        popularPost: false
    }, {
        img: "https://picsum.photos/id/1025/600/400",
        title: "Intro to React Native",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        popularPost: false
    }
];



app.get("/", (req, res) => {
    res.render("index", {
        posts: posts
    })
})

app.get("/post/:postTitle", (req, res) => {
    const postTitle = req.params.postTitle;
    posts.forEach(post => {
        if (postTitle === post.title) {
            res.render("post", {
                post: post
            })
        }
    });
})

app.get("/compose", (req, res) => {
    res.render("compose")
})

app.post('/compose', function (req, res) {
    let sampleFile;
    let uploadPath;

    const postTitle = req.body.postTitle;
    const postContent = req.body.postContent
    sampleFile = req.files.imgFile;
    const sampleFileName = sampleFile.name
    uploadPath = __dirname+ "/public/upload/" + sampleFileName;


    sampleFile.mv(uploadPath, function (err) {
        if (err) 
            return res.status(500).send(err);
        const post = {
            img: "/upload/" + sampleFileName ,
            title: postTitle,
            content: postContent,
            popularPost: false
        };
        posts.push(post);
        res.redirect("/")


    });
});

app.listen(3000, () => {
    console.log("Server started at port 3000")
})