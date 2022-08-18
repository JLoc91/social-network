import { useParams } from "react-router";
import { useState, Link, useEffect } from "react";

export default function FriendButton(userId) {
    const [friendshipData, setFriendshipData] = useState({});
    // console.log("userId in FriendButton: ", userId);
    const userid = userId.userId;
    // console.log("userid in FriendButton: ", userid);
    // console.log("render friendButton");
    useEffect(() => {
        fetch(`/api/getFriendship/${userid}`)
            .then((response) => response.json())
            .then((friendshipDataBack) => {
                // console.log("data.sameUser: ", data.sameUser);
                // if (data.sameUser) {
                //     location.href("/");
                // }
                setFriendshipData(friendshipDataBack);
                // console.log("friendshipData: ", friendshipData);
            });
    }, []);

    function sendFriendRequest(data) {
        // console.log("ready to send a friend Request");
        // console.log("data in sendFriendRequest: ", data);
        fetch(`/api/addFriendship/${userid}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((addResponse) => {
                // console.log("addResponse: ", addResponse);
                setFriendshipData(addResponse);
            })
            .catch((err) => console.log("err in addFriendship fetch: ", err));
    }

    function acceptFriendRequest(data) {
        // console.log("ready to accept a friend Request");
        // console.log("data in acceptFriendRequest: ", data);
        fetch(`/api/acceptFriendship/${userid}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((acceptResponse) => {
                // console.log("acceptResponse: ", acceptResponse);
                setFriendshipData(acceptResponse);
            })
            .catch((err) =>
                console.log("err in acceptFriendship fetch: ", err)
            );
    }

    function deleteFriendship(data) {
        // console.log("ready to delete friendship");
        // console.log("data in deleteFriendship: ", data);
        fetch(`/api/deleteFriendship/${userid}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((deleteResponse) => {
                // console.log("deleteResponse: ", deleteResponse);
                if (deleteResponse.id) {
                    console.log("friendship still exists");
                } else {
                    setFriendshipData(deleteResponse);
                }
                // location.href = "/";
            })
            .catch((err) =>
                console.log("err in deleteFriendship fetch: ", err)
            );
    }

    // console.log("friendshipData before render: ", friendshipData);
    // console.log("friendshipData: ", friendshipData);

    if (!friendshipData.id) {
        return (
            <>
                <button onClick={() => sendFriendRequest(friendshipData)}>
                    Send Friend Request
                </button>
            </>
        );
    } else {
        if (friendshipData.accepted) {
            return (
                <button onClick={() => deleteFriendship(friendshipData)}>
                    Unfriend
                </button>
            );
        } else {
            // console.log("friendshipData.myRequest: ", friendshipData.myRequest);
            if (friendshipData.myRequest) {
                return (
                    <button onClick={() => deleteFriendship(friendshipData)}>
                        Cancel Request
                    </button>
                );
            } else {
                return (
                    <>
                        <button
                            onClick={() => acceptFriendRequest(friendshipData)}
                        >
                            Accept Friendship
                        </button>
                        <br></br>
                        <button
                            onClick={() => deleteFriendship(friendshipData)}
                        >
                            Decline Friendship
                        </button>
                    </>
                );
            }
        }
    }
}
