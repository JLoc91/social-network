const express = require("express");
const app = express();
//part 10
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const s3 = require("./s3.js");
const {
    uploader,
    notLoggedInRedirect,
    loggedInRedirect,
} = require("./middleware.js");
const db = require("./db");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses.js");

const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets.json").COOKIE_SECRET;

const cookieSessionMiddleware = cookieSession({
    secret: COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
});

app.use(cookieSessionMiddleware);
//part10
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(cookieParser());

// Enable easy parsing of HTTP forms sent in a request
app.use(express.urlencoded({ extended: false }));
// Enable us to unpack JSON in the request body!
app.use(express.json());

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/api/user/id.json", function (req, res) {
    console.log("req.session.userid in user/id.json: ", req.session.userid);

    res.json({
        userid: req.session.userid,
    });
});

app.get("/api/userData", (req, res) => {
    console.log("get all user data");
    req.session.userid;
    db.getEverything(req.session.userid)
        .then((result) => {
            console.log("result.rows[0]: ", result.rows[0]);
            res.json(result.rows[0]);
        })
        .catch((err) => console.log("err in getEverything: ", err));
});

app.get("/api/userData/:id", (req, res) => {
    console.log("get all user data");
    console.log("req.params.id: ", req.params.id);
    console.log("req.session.userid: ", req.session.userid);
    // let sameUser = false;
    // if (req.params.id == req.session.userid) {
    //     sameUser = true;
    // }

    db.getEverything(req.params.id)
        .then((result) => {
            console.log("result.rows[0]: ", result.rows[0]);
            // result.rows[0].sameUser = sameUser;
            res.json(result.rows[0]);
        })
        .catch((err) => console.log("err in getEverything: ", err));
});

app.get("/api/getFriendship/:id", (req, res) => {
    console.log("get all friendship data");
    console.log("req.params.id: ", req.params.id);
    const paramsId = parseInt(req.params.id);
    console.log("req.session.userid: ", req.session.userid);

    db.getFriendshipInfo(paramsId, req.session.userid)
        .then((result) => {
            let myRequest = false;
            if (result.rows[0].sender_id == req.session.userid) {
                myRequest = true;
            }
            result.rows[0].myRequest = myRequest;
            console.log("result.rows[0]: ", result.rows[0]);
            res.json(result.rows[0]);
        })
        .catch((err) => console.log("err in getEverything: ", err));
});

app.get("/api/getFriendsAndWannabes", (req, res) => {
    console.log("get all friends' and wannabes' data");
    console.log("req.session.userid: ", req.session.userid);

    db.getFriendsAndWannabes(req.session.userid)
        .then((result) => {
            console.log(
                "result.rows from getFriendsAndWannabes: ",
                result.rows
            );
            res.json(result.rows);
        })
        .catch((err) => console.log("err in getFriendsAndWannabe: ", err));
});

app.get("/api/findPeoples", (req, res) => {
    console.log("get recent users");
    db.findPeopleStart()
        .then((result) => {
            console.log("result.rows: ", result.rows);
            res.json(result.rows);
        })
        .catch((err) => console.log("err in getEverything: ", err));
});

app.get("/api/findPeople/:word", (req, res) => {
    console.log("get recent users");
    console.log("req.params.word: ", req.params.word);
    db.findPeople(req.params.word)
        .then((result) => {
            console.log("result.rows: ", result.rows);
            res.json(result.rows);
        })
        .catch((err) => console.log("err in getEverything: ", err));
});

app.get("/api/logout", (req, res) => {
    console.log("user logged out");
    req.session = undefined;
    res.redirect("/");
});

app.post("/api/register", (req, res) => {
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
            req.session.userid = id;
            res.json({
                userid: req.session.userid,
            });
        })
        .catch((err) => console.log("err in insertUser: ", err));
});

app.post(
    "/api/login",
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

app.post("/api/reset-password", (req, res) => {
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
                        res.json({});
                    });
                }
            }
        })
        .catch((err) => console.log("error in getCodesFromDb: ", err));

    return;
});

app.post("/api/sendCode", (req, res) => {
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

app.post("/api/sendMessage", (req, res) => {
    // send the email if the user is registered

    console.log("req.body in sendMessage: ", req.body);
    db.insertMessage(req.body)
        .then((result) => {
            console.log("sendMessage Rückgabe: ", result.rows);
        })
        .catch((err) => console.log("err in insertMessage: ", err));
});

app.post("/api/addBio", (req, res) => {
    // send the email if the user is registered

    console.log("req.body in addBio: ", req.body);
    console.log("req.body.draftBio in addBio: ", req.body.draftBio);
    console.log("typeof req.body.draftBio: ", typeof req.body.draftBio);
    db.insertBio(req.body.draftBio, req.session.userid)
        .then((result) => {
            console.log("Bio Rückgabe: ", result.rows[0].email);
            res.json(result.rows[0]);
        })
        .catch((err) => console.log("err in addBio: ", err));
});

app.post(`/api/addFriendship/:id`, (req, res) => {
    console.log("in addFriendship");
    req.session.userid;
    console.log("req.params.id: ", req.params.id);
    db.insertFriendship(req.session.userid, req.params.id).then((result) => {
        let myRequest = false;
        if (result.rows[0].sender_id == req.session.userid) {
            myRequest = true;
        }
        result.rows[0].myRequest = myRequest;
        console.log("result.rows[0] after addFriendship: ", result.rows[0]);
        res.json(result.rows[0]);
    });
});

app.post(`/api/acceptFriendship/:id`, (req, res) => {
    console.log("in acceptFriendship");
    req.session.userid;
    console.log("req.params.id: ", req.params.id);
    db.acceptFriendship(req.session.userid, req.params.id)
        .then((result) => {
            console.log(
                "result.rows[0] after acceptFriendship: ",
                result.rows[0]
            );
            res.json(result.rows[0]);
        })
        .catch((err) => console.log("err in acceptFriendship: ", err));
});

app.post(`/api/deleteFriendship/:id`, (req, res) => {
    console.log("in deleteFriendship");

    console.log("req.params.id: ", req.params.id);
    db.deleteFriendship(req.session.userid, req.params.id).then((result) => {
        console.log("result.rows after deleteFriendship: ", result.rows);
        res.json({ success: true });
    });
});

//from imageboard
app.post("/api/image", uploader.single("photo"), s3.upload, (req, res) => {
    //grab the image that was sent [multer]
    //save it somewhere [multer]
    //respond to the client - success/failure
    console.log("req.session.userid in app.post: ", req.session.userid);
    console.log("req.file in app.post : ", req.file);
    console.log("req.body in app.post : ", req.body);

    //req.file is created by MUlter if the upload worked!
    req.body.awsurl = path.join(
        "https://s3.amazonaws.com/spicedling/",
        req.file.filename
    );
    if (req.file) {
        // console.log("req.file: ", req.file);
        db.insertImage(req.body.awsurl, req.session.userid)
            .then((result) => {
                console.log("result: ", result);
                req.session.first = result.rows[0].first;
                req.session.last = result.rows[0].last;
                req.session.url = result.rows[0].url;
            })
            .then(() => {
                res.json({
                    success: true,
                    message: "File uploaded. Good job! 🚀",
                    file: `/${req.file.filename}`,
                    url: req.session.url,
                    first: req.session.first,
                    last: req.session.last,
                });
                // res.json({});
            })
            .catch((err) => console.log("err in insertImage: ", err));
    } else {
        res.json({
            success: false,
            message: "File upload failed. 😥",
        });
    }
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

//changed to server.listen because of part 10, socket.io
server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

io.on("connection", (socket) => {
    if (!socket.request.session.userid) {
        console.log("no userId");
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userid;
    console.log(
        `User with id: ${userId} and socket id ${socket.id}, just connected!`
    );

    console.log("get recent chat messages");
    db.getChatMessages()
        .then((result) => {
            console.log("result.rows: ", result.rows);
            // res.json(result.rows);
            socket.emit("last-10-messages", result.rows);
        })
        .catch((err) => console.log("err in getEverything: ", err));

    socket.on("new-message", ({ messageText }) => {
        console.log("new-message", messageText);
        let newMessageObj = {};
        db.insertChatMessage(userId, messageText)
            .then((messageReturn) => {
                console.log("messageReturn.rows[0]: ", messageReturn.rows[0]);
                newMessageObj = {
                    id: messageReturn.rows[0].id,
                    user_id: userId,
                    message: messageText,
                    timestamp: messageReturn.rows[0].timestamp,
                };
            })
            .then(() => {
                db.getUserInfo(userId).then((userReturn) => {
                    console.log("userReturn.rows[0]: ", userReturn.rows[0]);
                    newMessageObj.first = userReturn.rows[0].first;
                    newMessageObj.last = userReturn.rows[0].last;
                    newMessageObj.url = userReturn.rows[0].url;
                    console.log("newMessageObj vor emit: ", newMessageObj);
                    io.emit("add-new-message", newMessageObj);
                });
            });
    });
});
