import react from "react";
import ProfilePic from "./ProfilePic";
import BioEditor from "./BioEditor";

export default function Profile({ togglePopup, url }) {
    console.log("Profile!");
    return (
        <>
            <h1>Hello from my profile</h1>
            <ProfilePic togglePopup={togglePopup} url={url} />
            <BioEditor />
        </>
    );
}
