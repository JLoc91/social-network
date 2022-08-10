import { useParams } from "react-router";
import { useState, Link } from "react";

export default function OtherProfile() {
    const { userId } = useParams();
    const [bio, setBio] = useState("");
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [url, setUrl] = useState("");
    console.log("userId: ", userId);
    fetch(`/api/userData/${userId}`)
        .then((response) => response.json())
        .then((data) => {
            console.log("data.sameUser: ", data.sameUser);
            if (data.sameUser) {
                location.href("/");
            }
            console.log("data: ", data);
            console.log("data.bio: ", data.bio);
            setBio(data.bio);
            setFirst(data.first);
            setLast(data.last);
            setUrl(data.url);

            // this.changeUrl(data.url, data.first, data.last, data.bio);
        });

    return (
        <>
            <>
                <div className="profilePicContainer">
                    <img src={url} alt={first}></img>
                </div>
            </>
            <div id="welcomeText">
                <h1>
                    {first} {last}
                </h1>
                <p className="bioText">{bio}</p>
            </div>
        </>
    );
}
