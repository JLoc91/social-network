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
    req.session.userid;
    db.getEverything(req.session.userid)
        .then((result) => {
            res.json(result.rows[0]);
        })
        .catch((err) => console.log("err in getEverything: ", err));
});

app.get("/api/userData/:id", (req, res) => {
    db.getEverything(req.params.id)
        .then((result) => {
            res.json(result.rows[0]);
        })
        .catch((err) => console.log("err in getEverything: ", err));
});

app.get("/api/getFriendship/:id", (req, res) => {
    const paramsId = parseInt(req.params.id);

    db.getFriendshipInfo(paramsId, req.session.userid)
        .then((result) => {
            let myRequest = false;
            if (result.rows[0].sender_id == req.session.userid) {
                myRequest = true;
            }
            result.rows[0].myRequest = myRequest;

            res.json(result.rows[0]);
        })
        .catch((err) => console.log("err in getEverything: ", err));
});

app.get("/api/getFriendsAndWannabes", (req, res) => {
    db.getFriendsAndWannabes(req.session.userid)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => console.log("err in getFriendsAndWannabe: ", err));
});

app.get("/api/findPeoples", (req, res) => {
    db.findPeopleStart()
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => console.log("err in getEverything: ", err));
});

app.get("/api/findPeople/:word", (req, res) => {
    db.findPeople(req.params.word)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => console.log("err in getEverything: ", err));
});

app.get("/api/deleteUser", (req, res) => {
    db.deleteUserFriendships(req.session.userid)
        .then((friendshipDeleteResult) => {
            // console.log(
            //     "friendshipDeleteResult.rows: ",
            //     friendshipDeleteResult.rows
            // );

            db.deleteUserMessages(req.session.userid).then(
                (messagesDeleteResult) => {
                    // console.log(
                    //     "messagesDeleteResult.rows: ",
                    //     messagesDeleteResult.rows
                    // );
                    db.deleteUser(req.session.userid)
                        .then((userDeleteResult) => {
                            // console.log(
                            //     "userDeleteResult.rows: ",
                            //     userDeleteResult.rows
                            // );
                            if (userDeleteResult.rows[0].url != null) {
                                s3.deletePicAWS(userDeleteResult.rows[0].url);
                            }
                        })
                        .then(() => {
                            req.session = undefined;
                            res.redirect("/login");
                        });
                }
            );
            // res.json(result.rows);
        })
        .catch((err) => console.log("err in getEverything: ", err));
});

app.get("/api/logout", (req, res) => {
    console.log("user logged out");
    req.session = undefined;
    res.redirect("/");
});

app.post("/api/register", (req, res) => {
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
    } else {
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
            .catch((err) => {
                console.log("err in insertUser: ", err);
                res.redirect("/");
            });
    }
});

app.post(
    "/api/login",
    (req, res) => {
        if (req.body.email === "" || req.body.password === "") {
            console.log("!!!ALL FIELDS MUST BE FILLED!!!");
            // res.render("/", {
            //     error: true,
            // });
            // res.json({ error: true });
            res.json({});
        } else {
            db.authenticate(req.body.email, req.body.password)
                .then((resultObj) => {
                    if (resultObj.passwordCheck) {
                        req.session.userid = resultObj.userid;

                        // console.log("yay it worked");
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
                    // res.redirect("/login");
                    // res.json({err});
                    res.json({});
                });
        }
    }
    // }
);

app.post("/api/reset-password", (req, res) => {
    // check code and email, and UPDATE the password
    //check if code and email are same
    db.getCodesFromDb(req.body.email)
        .then((data) => {
            for (let i = 0; i < data.rows.length; i++) {
                if (req.body.code === data.rows[i].code) {
                    console.log("code is correct");
                    db.changePassword(
                        req.body.newPassword,
                        req.body.email
                    ).then((data) => {
                        console.log("password successfully changed ");

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

    db.checkEmail(req.body.email)
        .then((result) => {
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

    db.insertMessage(req.body)
        .then((result) => {
            // console.log("sendMessage Rückgabe: ", result.rows);
        })
        .catch((err) => console.log("err in insertMessage: ", err));
});

app.post("/api/addBio", (req, res) => {
    // send the email if the user is registered

    db.insertBio(req.body.draftBio, req.session.userid)
        .then((result) => {
            res.json(result.rows[0]);
        })
        .catch((err) => console.log("err in addBio: ", err));
});

app.post(`/api/addFriendship/:id`, (req, res) => {
    req.session.userid;

    db.insertFriendship(req.session.userid, req.params.id).then((result) => {
        let myRequest = false;
        if (result.rows[0].sender_id == req.session.userid) {
            myRequest = true;
        }
        result.rows[0].myRequest = myRequest;

        res.json(result.rows[0]);
    });
});

app.post(`/api/acceptFriendship/:id`, (req, res) => {
    req.session.userid;

    db.acceptFriendship(req.session.userid, req.params.id)
        .then((result) => {
            res.json(result.rows[0]);
        })
        .catch((err) => console.log("err in acceptFriendship: ", err));
});

app.post(`/api/deleteFriendship/:id`, (req, res) => {
    db.deleteFriendship(req.session.userid, req.params.id).then((result) => {
        res.json({ success: true });
    });
});

//from imageboard
app.post("/api/image", uploader.single("photo"), s3.upload, (req, res) => {
    //grab the image that was sent [multer]
    //save it somewhere [multer]
    //respond to the client - success/failure

    //req.file is created by MUlter if the upload worked!
    req.body.awsurl = path.join(
        "https://s3.amazonaws.com/spicedling/",
        req.file.filename
    );
    if (req.file) {
        // console.log("req.file: ", req.file);
        db.getImage(req.session.userid).then((resultImage) => {
            console.log("resultImage.rows[0]: ", resultImage.rows[0]);
            const oldPicUrl = resultImage.rows[0].url;
            db.insertImage(req.body.awsurl, req.session.userid)
                .then((result) => {
                    req.session.first = result.rows[0].first;
                    req.session.last = result.rows[0].last;
                    req.session.url = result.rows[0].url;
                })
                .then(() => {
                    if (oldPicUrl != null) {
                        s3.deletePicAWS(oldPicUrl);
                    }
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
        });
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

const onlineUser = {};

io.on("connection", (socket) => {
    if (!socket.request.session.userid) {
        console.log("no userId");
        return socket.disconnect(true);
    }
    const userId = socket.request.session.userid;
    console.log("onlineUser before: ", onlineUser);
    // console.log(onlineUser.hasOwnProperty(userId));
    if (onlineUser.hasOwnProperty(userId)) {
        onlineUser[userId].push(socket.id);
    } else {
        onlineUser[userId] = [socket.id];
    }

    console.log("onlineUser after: ", onlineUser);
    let onlineUserArray = Object.keys(onlineUser);
    db.getOnlineUserInfo(onlineUserArray).then((resultUserInfo) => {
        // console.log("resultUserInfo.rows: ", resultUserInfo.rows);
        const onlineUsersPackage = {
            onlineUser: onlineUser,
            userInfo: resultUserInfo.rows,
        };
        // console.log("onlineUsersPackage in server: ", onlineUsersPackage);
        io.emit("update-online-people", onlineUsersPackage);
    });
    // if (!onlineUser.indexOf(userId)) {
    //     onlineUser.push(userId);
    //     console.log("onlineUser: ", onlineUser);
    // }

    console.log(
        `User with id: ${userId} and socket id ${socket.id}, just connected!`
    );

    // console.log("get recent chat messages");
    db.getChatMessages()
        .then((result) => {
            socket.emit("last-10-messages", result.rows);
        })
        .catch((err) => console.log("err in getEverything: ", err));

    socket.on("new-message", ({ messageText }) => {
        let newMessageObj = {};
        db.insertChatMessage(userId, messageText)
            .then((messageReturn) => {
                newMessageObj = {
                    id: messageReturn.rows[0].id,
                    user_id: userId,
                    message: messageText,
                    timestamp: messageReturn.rows[0].timestamp,
                };
            })
            .then(() => {
                db.getUserInfo(userId).then((userReturn) => {
                    newMessageObj.first = userReturn.rows[0].first;
                    newMessageObj.last = userReturn.rows[0].last;
                    newMessageObj.url = userReturn.rows[0].url;

                    io.emit("add-new-message", newMessageObj);
                });
            });
    });

    socket.on("disconnect", () => {
        console.log("onlineUser[userId]: ", onlineUser[userId]);
        console.log("socket.id: ", socket.id);
        // console.log(onlineUser[userId].indexOf(socket.id));
        // console.log("userId.toString(): ", userId.toString());

        if (onlineUser[userId].length <= 1) {
            delete onlineUser[userId];
        } else {
            onlineUser[userId].splice(onlineUser[userId].indexOf(socket.id));
        }
        console.log(
            `User with id: ${userId} and socket id ${socket.id}, just disconnected!`
        );
        console.log("onlineUser after disconnect: ", onlineUser);
        let onlineUserArray = Object.keys(onlineUser);
        db.getOnlineUserInfo(onlineUserArray).then((resultUserInfo) => {
            console.log("resultUserInfo.rows: ", resultUserInfo.rows);
            const onlineUsersPackage = {
                onlineUser: onlineUser,
                userInfo: resultUserInfo.rows,
            };
            console.log("onlineUsersPackage in server: ", onlineUsersPackage);
            io.emit("update-online-people", onlineUsersPackage);
        });
        // io.emit("update-online-people", onlineUser);
    });
});
