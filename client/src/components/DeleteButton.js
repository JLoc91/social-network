import { Link } from "react-router-dom";

export default function DeleteButton() {
    return (
        <p
            onClick={() => {
                if (
                    confirm(
                        "Do you really want to delete your account and all your messages?"
                    )
                ) {
                    console.log("Try to delete account");
                    fetch(`api/deleteUser`).then(() => {
                        console.log("wir sind wieder hier");
                        location.href = "/";
                    });
                } else {
                    console.log("Account not deleted");
                    <Link to="/" />;
                }
            }}
        >
            Delete Account
        </p>
    );
}
