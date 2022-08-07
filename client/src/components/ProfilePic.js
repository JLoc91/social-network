import React from "react";

export default function ProfilePic({ togglePopup, imgFromApp, changeName }) {
    // console.log("PROPS in profilePic: ", props);

    imgFromApp = imgFromApp || "/default.png";

    return (
        <>
            <button onClick={togglePopup}>Toggle Popup</button>
            <button onClick={() => changeName("Spiced")}>Change Name</button>
        </>
    );
}
