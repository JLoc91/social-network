import react from "react";
import ProfilePic from "./ProfilePic";
import BioEditor from "./BioEditor";

export default function Profile({
    togglePopup,
    url,
    first,
    last,
    bio,
    changeBio,
}) {
    // export default function Profile() {
    // console.log("togglePopup: ", togglePopup);
    // console.log("url: ", url);
    // console.log("first: ", first);
    // console.log("last: ", last);
    // console.log("bio: ", bio);
    // console.log("Profile!");
    return (
        <>
            <ProfilePic
                togglePopup={togglePopup}
                url={url}
                first={first}
                last={last}
            />
            <div id="welcomeText">
                <h1>
                    {first} {last}
                </h1>
                <BioEditor changeBio={changeBio} bio={bio} />
            </div>
        </>
    );
}
