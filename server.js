// declare global variables
const express = require("express");
const multer = require("multer");
const autoReap  = require("multer-autoreap");
const path = require("path");
const app = express();
var port = process.env.PORT || 8080;
var upload = multer({ dest: "./taster/"});

// setup view routes
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));
app.use(autoReap);

// render home page
app.get("/", (req, res, next) => {
    res.render("index");
    next();
});

// read file with EJS response
app.post("/ejs", upload.single("f_up"), (req, res, next) => {
    if (!req.file) {
        res.send("Oops. No file selected. Go back and try again.");
    }
    res.render("tasted", {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: (Number(req.file.size)/1048576).toFixed(3)
    });
});

// read file with EJS response
app.post("/json", upload.single("f_up"), (req, res, next) => {
    var response = {};
    response.name = req.file.originalname;
    response.type = req.file.mimetype;
    response.mb = (Number(req.file.size)/1048576).toFixed(3) + " MB";
    res.json(response);
});

// always use port 8080 on c9.io
app.listen(port, () => {
    console.log("File taster app is live on port #" + port + ", baby!");
});