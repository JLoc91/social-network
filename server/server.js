const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const db = require("./db");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses.js");

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
    // sendEmail(1);

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
        console.log("!!!ALL FIELDS MUST BE FILLED!!!");
        // res.redirect("/");
        // return;
        res.json({});
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

app.post(
    "/login",
    (req, res) => {
        // if (req.session.userid) {
        //     res.redirect("/");
        // } else {
        console.log("login post received");
        console.log("req.body: ", req.body);
        if (req.body.email === "" || req.body.password === "") {
            console.log("!!!ALL FIELDS MUST BE FILLED!!!");
            // res.render("/", {
            //     error: true,
            // });
            // res.json({ error: true });
            res.json({});
        } else {
            console.log("req.body before authenticate: ", req.body);
            db.authenticate(req.body.email, req.body.password)
                .then((resultObj) => {
                    console.log("resultObj: ", resultObj);
                    if (resultObj.passwordCheck) {
                        req.session.userid = resultObj.userid;
                        req.session.profile = true;
                        console.log("yay it worked");
                        res.json({
                            userid: req.session.userid,
                        });
                    } else {
                        console.log("not authenticated correctly");
                        res.json({});
                    }
                })
                .catch((err) => {
                    console.log("err in authenticate: ", err);
                    res.redirect("/login");
                });
        }
    }
    // }
);

app.post("/reset-password", (req, res) => {
    // check code and email, and UPDATE the password
    console.log("req.body in reset-password: ", req.body);
    //check if code and email are same
    db.getCodesFromDb(req.body.email)
        .then((data) => {
            console.log("data in checkCode: ", data.rows);
            for (let i = 0; i < data.rows.length; i++) {
                console.log("data.rows[i]: ", data.rows[i]);
                if (req.body.code === data.rows[i].code) {
                    console.log("code is correct");
                    db.changePassword(
                        req.body.newPassword,
                        req.body.email
                    ).then((data) => {
                        console.log("password successfully changed ");
                        console.log("data: ", data);
                    });
                }
            }
        })
        .catch((err) => console.log("error in getCodesFromDb: ", err));

    return;
});

app.post("/sendCode", (req, res) => {
    // send the email if the user is registered

    console.log("req.body in sendCode: ", req.body);
    db.checkEmail(req.body.email)
        .then((result) => {
            console.log("email Rückgabe: ", result.rows[0].email);
            const secretCode = cryptoRandomString({
                length: 6,
            });

            db.insertCode(result.rows[0].email, secretCode).then((result) => {
                sendEmail(result.rows[0].email, secretCode);
                res.json(result.rows[0]);
            });
        })
        .catch((err) => console.log("err in checkEmail: ", err));
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
