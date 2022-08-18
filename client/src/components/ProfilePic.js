import React from "react";

export default function ProfilePic({ togglePopup, url, first, last }) {

    url =
        url ||
        "https:/s3.amazonaws.com/spicedling/-E2SRd1Y-R4G67_JbXqfpMtcmerzTutu.png";


    const altText = first + last;


    return (
        <>
            <div className="profilePicContainer">
                <img src={url} alt={altText} onClick={togglePopup}></img>
            </div>
        </>
    );
}
