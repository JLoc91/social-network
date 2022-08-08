import react from "react";
import ProfilePic from "./ProfilePic";
import BioEditor from "./BioEditor";

export default function Profile({ togglePopup, url, first, last, bio }) {
    // export default function Profile() {
    console.log("togglePopup: ", togglePopup);
    console.log("url: ", url);
    console.log("first: ", first);
    console.log("last: ", last);
    console.log("bio: ", bio);
    console.log("Profile!");
    return (
        <>
            <ProfilePic
                togglePopup={togglePopup}
                url={url}
                first={first}
                last={last}
            />
            <h1 id="welcomeText">
                {first} {last}
            </h1>
            {/* <BioEditor bio={bio} /> */}
        </>
    );
}
