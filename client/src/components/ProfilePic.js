import React from "react";

export default function ProfilePic({ togglePopup, url, first, last }) {
    // console.log("PROPS in profilePic: ", props);
    console.log("url before: ", url);
    console.log("first: ", first);
    console.log("last: ", last);

    url =
        url ||
        "https:/s3.amazonaws.com/spicedling/-E2SRd1Y-R4G67_JbXqfpMtcmerzTutu.png";

    console.log("url after: ", url);
    const altText = first + last;
    console.log("altText: ", altText);

    return (
        <>
            <div className="profilePicContainer">
                <img src={url} alt={altText} onClick={togglePopup}></img>
            </div>
        </>
    );
}
