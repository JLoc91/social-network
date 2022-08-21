import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    acceptFriend,
    receiveFriendsAndWannabes,
    unfriend,
} from "../redux/Friends/slice";

export default function FriendsAndWannabes() {
    const dispatch = useDispatch();

    const wannabes = useSelector(
        (state) =>
            state.friendsList.friendships &&
            state.friendsList.friendships.filter((friend) => !friend.accepted)
    );
    // console.log("wannabes: ", wannabes);

    const friends = useSelector(
        (state) =>
            state.friendsList.friendships &&
            state.friendsList.friendships.filter((friend) => friend.accepted)
    );

    // console.log("friends: ", friends);

    // load data from server and pass it to redux
    // only when the component first loads!
    useEffect(() => {
        // if (!wannabes) {
        (async () => {
            // console.log("render Friends");
            const res = await fetch(`/api/getFriendsAndWannabes`);
            const data = await res.json();
            // console.log("data from findPeopleStart: ", data);
            const alteredData = { friendships: data };
            // STEP 5!!!!
            dispatch(receiveFriendsAndWannabes(alteredData));
        })();
        // }
    }, []);

    if (!wannabes) {
        return null;
    }
    // console.log("friends: ", friends);
    // very important!
    // it allows the DOM to react to changes in Redux data!

    // console.log(
    //     "useSelector((state)=> {console.log(state.friendsAndWannabe)}): ",
    //     useSelector((state) => {
    //         console.log(state.friendsAndWannabe);
    //     })
    // );

    // function to accept a single user
    // param: user's id!
    const handleAccept = async (id) => {
        const res = await fetch(`/api/acceptFriendship/${id}`, {
            method: "post",
        });
        const data = await res.json();
        // console.log("data from handleAccept: ", data);
        dispatch(acceptFriend(data.sender_id));
    };
    const handleUnfriend = async (id) => {
        const res = await fetch(`/api/deleteFriendship/${id}`, {
            method: "post",
        });
        const data = await res.json();
        // console.log("data from handleUnfriend: ", data);
        if (data.success) {
            dispatch(unfriend(id));
        } else {
            console.log("error in deleting friendship in database");
        }
        // 1. make a POST request (fetch) to update the server!
        // 2. make sure update was successful on server
        // 3. prepare an action for our reducer
        // 4. dispatch action to reducer

        // ...
        // const action = acceptFriend(id);
        // dispatch(action);
    };
    
    return (
        <>
            <div id="friendscontainer">
                <h2>These people want to be your friends</h2>
                <div className="wannabes">
                    {wannabes &&
                        wannabes.map((wannabe) => {
                            // console.log("wannabe: ", wannabe);
                            return (
                                <div className="wannabe" key={wannabe.id}>
                                    <div className="profilePicContainer">
                                        <img
                                            src={wannabe.url}
                                            alt={wannabe.first}
                                            className="shadow"
                                            onClick={() =>
                                                (location.href = `/user/${wannabe.id}`)
                                            }
                                        ></img>
                                    </div>
                                    <div className="nameAndButton">
                                        <p>
                                            {wannabe.first} {wannabe.last}
                                        </p>
                                        <button
                                            onClick={() => {
                                                handleAccept(wannabe.id);
                                            }}
                                        >
                                            Accept Request
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleUnfriend(wannabe.id);
                                            }}
                                        >
                                            Decline Request
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <br></br>
                <h2>These people are currently your friends</h2>
                <div className="friends">
                    {friends &&
                        friends.map((friend) => {
                            // console.log("friend: ", friend);
                            return (
                                <div className="friend" key={friend.id}>
                                    <div className="profilePicContainer">
                                        <img
                                            src={friend.url}
                                            alt={friend.first}
                                            className="shadow"
                                            onClick={() =>
                                                (location.href = `/user/${friend.id}`)
                                            }
                                        ></img>
                                    </div>
                                    <div className="nameAndButton">
                                        <p>
                                            {friend.first} {friend.last}
                                        </p>
                                        <button
                                            onClick={() => {
                                                handleUnfriend(friend.id);
                                            }}
                                        >
                                            Unfriend
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
}
