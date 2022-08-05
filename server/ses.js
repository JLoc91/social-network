const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1", // Make sure this corresponds to the region in which you have verified your email address (or 'eu-west-1' if you are using the Spiced credentials)
});

exports.sendEmail = function (email, code) {
    return ses
        .sendEmail({
            Source: "JLoco <rainbow.goldfish@spicedling.email>",
            Destination: {
                ToAddresses: ["rainbow.goldfish@spicedling.email"],
            },
            Message: {
                Body: {
                    Text: {
                        Data: `Here is the code for reseting your password: ${code}`,
                    },
                },
                Subject: {
                    Data: "Code for resetting your password!",
                },
            },
        })
        .promise()
        .then(() => console.log("it worked!"))
        .catch((err) => console.log(err));
};
