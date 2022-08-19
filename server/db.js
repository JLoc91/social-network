const spicedPg = require("spiced-pg");
const tableUser = "users";
const tableCode = "reset_codes";
const tableFriendships = "friendships";
const tableChatMessages = "chat_messages";
const bcrypt = require("bcryptjs");
// const { profile } = require("console");
let dbURL;

if (process.env.NODE_ENV === "production") {
    dbURL = process.env.DATABASE_URL;
} else {
    const { user, password, database } = require("./secrets.json");
    dbURL = `postgres:${user}:${password}@localhost:5432/${database}`;
}

const db = spicedPg(dbURL);

function hashPassword(password) {
    //1. Generate a salt
    //2. Hash the password with the salt
    //3. Return the hash [PROMISE]
    return bcrypt
        .genSalt()
        .then((salt) => {
            const hash = bcrypt.hash(password, salt);
            console.log("hash in function: ", hash);
            return hash;
        })
        .catch((err) => console.log("error in hashPassword function: ", err));
}

module.exports.insertUser = (first, last, email, password) => {
    return hashPassword(password)
        .then((hash) => {
            first = capitalizeParameter(first);
            last = capitalizeParameter(last);
            return db.query(
                `INSERT INTO ${tableUser}(first, last, email, password)
        VALUES ($1, $2, $3, $4) returning id`,
                [first, last, email, hash]
            );
        })
        .catch((err) => {
            if (
                err.message ===
                'duplicate key value violates unique constraint "users_email_key"'
            ) {
                console.log("email already exists");
                return "email already exists";
            }
            console.log("err in hashPassword: ", err);
        });
};

function capitalizeParameter(par) {
    let eachWord = par.toLowerCase().split(" ");
    for (let i = 0; i < eachWord.length; i++) {
        eachWord[i] =
            eachWord[i].charAt(0).toUpperCase() + eachWord[i].substring(1);
    }
    let fullPar = eachWord.join(" ");
    return fullPar;
}

module.exports.authenticate = (email, password) => {
    return findUser(email)
        .then((result) => {
            if (!result.rows[0]) {
                console.log("kein user gefunden");
                return [];
            } else {
                let userid = result.rows[0].id;
                const resultObj = {
                    enteredPassword: password,
                    dbPassword: result.rows[0].password,
                    userid: result.rows[0].id,
                };

                return comparePassword(password, result.rows[0].password)
                    .then((passwordCheck) => {
                        resultObj.passwordCheck = passwordCheck;

                        return resultObj;
                    })
                    .catch((err) =>
                        console.log("err in comparePassword: ", err)
                    );
            }
        })
        .catch((err) => console.log("error in findUser: ", err));
};

function findUser(email) {
    return db.query(`select * from ${tableUser}
    where "email" = '${email}'`);
}

function comparePassword(password, dbPassword) {
    return bcrypt.compare(password, dbPassword);
}

module.exports.checkEmail = (email) => {
    return db.query(`select * from users where email='${email}'`);
};

module.exports.insertCode = (email, code) => {
    return db.query(
        `insert into ${tableCode} (email, code)
    values ($1, $2) returning *`,
        [email, code]
    );
};

module.exports.getCodesFromDb = (email) => {
    return db.query(
        `        SELECT * FROM ${tableCode}
WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'
and email='${email}'`
    );
};

module.exports.changePassword = (newPassword, email) => {
    return hashPassword(newPassword)
        .then((hash) => {
            newPassword = hash;
            // use other approach with values
            return db.query(
                `update ${tableUser} set password='${newPassword}'
                WHERE email='${email}' `
            );
        })
        .catch((err) => console.log("err in hashPassword: ", err));
};

module.exports.getEverything = (id) => {
    return db.query(`select * from ${tableUser} where id=${id}`);
};

module.exports.findPeopleStart = () => {
    return db.query(`SELECT * FROM ${tableUser} ORDER BY id DESC LIMIT 3`);
};

module.exports.findPeople = (input) => {
    return db.query(`SELECT * FROM ${tableUser} WHERE first ILIKE $1;`, [
        input + "%",
    ]);
};

module.exports.insertImage = (url, id) => {
    return db.query(
        `update ${tableUser} set url='${url}'
        WHERE id=${id} returning *`
    );
};

module.exports.insertBio = (bio, id) => {
    return db.query(
        `update ${tableUser} set bio=$1
        WHERE id=$2 returning *`,
        [bio, id]
    );
};

module.exports.getFriendshipInfo = (user1, user2) => {
    const query = `
        SELECT * FROM ${tableFriendships}
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1)`;
    return db.query(query, [user1, user2]);
};

module.exports.insertFriendship = (user1, user2) => {
    return db.query(
        `insert into ${tableFriendships} (sender_id, recipient_id, accepted)
    values ($1, $2, $3) returning *`,
        [user1, user2, false]
    );
};

module.exports.acceptFriendship = (user1, user2) => {
    const query = `update ${tableFriendships} set accepted = true
    WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1) returning *`;
    return db.query(query, [user1, user2]);
};

module.exports.deleteFriendship = (user1, user2) => {
    const query = `
        DELETE FROM ${tableFriendships} WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1)`;
    return db.query(query, [user1, user2]);
};

module.exports.getFriendsAndWannabes = (user) => {
    const query = `
    SELECT ${tableUser}.id, first, last, accepted, url FROM ${tableUser}
    JOIN ${tableFriendships}
    ON (accepted = true AND recipient_id = $1 AND ${tableUser}.id = ${tableFriendships}.sender_id)
    OR (accepted = true AND sender_id = $1 AND ${tableUser}.id = ${tableFriendships}.recipient_id)
    OR (accepted = false AND recipient_id = $1 AND ${tableUser}.id = ${tableFriendships}.sender_id)
    `;
    return db.query(query, [user]);
};

module.exports.getChatMessages = () => {
    const query = `
    SELECT ${tableChatMessages}.id, ${tableChatMessages}.user_id, message, ${tableChatMessages}.timestamp, ${tableUser}.first, ${tableUser}.last, ${tableUser}.url FROM ${tableChatMessages}
    JOIN ${tableUser}
    ON (${tableChatMessages}.user_id = ${tableUser}.id)
    `;
    return db.query(query);
};

module.exports.insertChatMessage = (userId, message) => {
    const query = `
    INSERT INTO ${tableChatMessages} (user_id, message) values ($1, $2) returning id, timestamp
    `;
    return db.query(query, [userId, message]);
};

module.exports.getUserInfo = (userId) => {
    const query = `
    select first, last, url from ${tableUser} where id=$1
    `;
    return db.query(query, [userId]);
};

module.exports.getOnlineUser = () => {
    const query = `
    select id, first, last, url from ${tableUser} where online=true
    `;
    return db.query(query);
};

module.exports.insertOnlineUser = (id) => {
    const query = `
    UPDATE ${tableUser} set online=true where id=$1
    `;
    return db.query(query, [id]);
};

module.exports.setUserOffline = (id) => {
    const query = `
    UPDATE ${tableUser} set online=false where id=$1
    `;
    return db.query(query, [id]);
};

module.exports.getOnlineUserInfo = (onlineUserArray) => {
    const query = `
    SELECT id, first, last, url
    FROM users WHERE id = ANY($1)
    `;
    const params = [onlineUserArray];
    return db.query(query, params);
};
