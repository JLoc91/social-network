const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const db = require("./db");

const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets.json").COOKIE_SECRET;

app.use(
    cookieSession({
        secret: COOKIE_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);
// Use middleware to help us read req.body, for submitted forms!
app.use(express.urlencoded({ extended: false }));
// Use middleware to help us read req.body, for json?????!
app.use(express.json());

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.post("/register", (req, res) => {
    console.log("post received");
    console.log("req.body: ", req.body);
    if (
        req.body.first == "" ||
        req.body.last == "" ||
        req.body.email == "" ||
        req.body.password == ""
    ) {
        res.redirect("/");
        return;
    }
    db.insertUser(
        req.body.first,
        req.body.last,
        req.body.email,
        req.body.password
    );
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
