const spicedPg = require("spiced-pg");
const tableUser = "users";
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
    //1. Hash the user's password [PROMISE]
    //2. Insert into the database with a query
    //3. Return the entire row --> not necessary???
    // so that we can store the user's id in the session!

    return hashPassword(password)
        .then((hash) => {
            // console.log("hash: ", hash);
            first = capitalizeParameter(first);
            last = capitalizeParameter(last);
            return db.query(
                `INSERT INTO ${tableUser}(first, last, email, password)
        VALUES ($1, $2, $3, $4) returning id`,
                [first, last, email, hash]
            );
        })
        .catch((err) => {
            // console.log("err.message: ", err.message);
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
    console.log("fullPar: ", fullPar);
    return fullPar;
}
