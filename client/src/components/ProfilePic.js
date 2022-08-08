import React from "react";

export default function ProfilePic({ togglePopup, imgFromApp, changeName }) {
    // console.log("PROPS in profilePic: ", props);

    imgFromApp =
        imgFromApp ||
        "https:/s3.amazonaws.com/spicedling/-E2SRd1Y-R4G67_JbXqfpMtcmerzTutu.png";

    return (
        <>
            <div className="profilePicContainer">
                <img
                    id="profilePic"
                    src={imgFromApp}
                    alt="logo"
                    onClick={togglePopup}
                ></img>
                <button onClick={() => changeName("Spiced")}>
                    Change Name
                </button>
            </div>
        </>
    );
}
