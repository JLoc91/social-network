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

app.use(cookieParser());

// Enable easy parsing of HTTP forms sent in a request
app.use(express.urlencoded({ extended: false }));
// Enable us to unpack JSON in the request body!
app.use(express.json());

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/user/id.json", function (req, res) {
    console.log("req.session.userid in user/id.json: ", req.session.userid);
    res.json({
        userid: req.session.userid,
    });
});

app.post("/register", (req, res) => {
    console.log("register post received");
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
    )
        .then((response) => {
            const id = response.rows[0].id;
            req.session.userId = id;
            res.json({
                userid: req.session.userid,
            });
        })
        .catch((err) => console.log("err in insertUser: ", err));
});

app.post("/login", (req, res) => {
    if (req.session.userid) {
        res.redirect("/petition");
    } else {
        console.log("register post received");
        console.log("req.body: ", req.body);
        if (req.body.email === "" || req.body.password === "") {
            console.log("!!!ALL FIELDS MUST BE FILLED!!!");
            res.render("/", {
                error: true,
            });
        } else {
            db.authenticate(req.body.email, req.body.password)
                .then((resultObj) => {
                    // if (authentication) {
                    console.log("resultObj: ", resultObj);
                    if (resultObj.passwordCheck) {
                        req.session.userid = resultObj.userid;
                        req.session.profile = true;
                        console.log("yay it worked");
                        res.json({
                            userid: req.session.userid,
                        });
                        // } else {
                    } else {
                        console.log("not authenticated correctly");
                        res.redirect("/login");
                    }
                })
                .catch((err) => {
                    console.log("err in authenticate: ", err);
                    res.redirect("/login");
                });
        }
    }
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
