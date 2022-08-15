import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    acceptFriend,
    receiveFriendsAndWannabes,
} from "../redux/Friends/slice";

export default function FriendsAndWannabes() {
    const dispatch = useDispatch();

    // load data from server and pass it to redux
    // only when the component first loads!
    useEffect(async () => {
        console.log("render Friends");
        fetch(`/api/getFriendsAndWannabes`)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from findPeopleStart: ", data);
                // setPeople(data);
                // STEP 5!!!!
                dispatch(receiveFriendsAndWannabes(data));
            });
    }, []);
    // very important!
    // it allows the DOM to react to changes in Redux data!

    const wannabes = useSelector((state) => {
        state.friendsAndWannabe &&
            state.friendsAndWannabe.filter((friend) => !friend.accepted);
    });

    const friends = useSelector((state) => {
        console.log(state.friendsAndWannabe);
    });

    console.log(
        "useSelector((state)=> {console.log(state.friendsAndWannabe)}): ",
        useSelector((state) => {
            console.log(state.friendsAndWannabe);
        })
    );
    console.log("wannabes: ", wannabes);
    console.log("friends: ", friends);

    // function to accept a single user
    // param: user's id!
    const handleAccept = (id) => {
        fetch(`/api/acceptFriendship/${id}`, {
            method: "post",
        })
            .then((response) => response.json())
            .then((acceptResponse) => {
                console.log("acceptResponse: ", acceptResponse);
                setFriendshipData(acceptResponse);
            })
            .catch((err) =>
                console.log("err in acceptFriendship fetch: ", err)
            );
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
            <div className="wannabes">
                <h2>Wannabes</h2>
                {wannabes &&
                    wannabes.map((wannabe) => {
                        console.log("wannabe: ", wannabe);
                        return (
                            <div key={wannabe.id}>
                                <p>info about the friend</p>
                                <button
                                    onClick={() => {
                                        handleAccept(wannabe.id);
                                    }}
                                >
                                    Accept
                                </button>
                            </div>
                        );
                    })}
            </div>
            <br></br>
            <div className="friends">
                <h2>Friends</h2>
                {friends &&
                    friends.map((friend) => {
                        console.log("friend: ", friend);
                        return (
                            <div key={friend.id}>
                                <p>info about the friend</p>
                                <button
                                    onClick={() => {
                                        handleUnfriend(friend.id);
                                    }}
                                >
                                    Accept
                                </button>
                            </div>
                        );
                    })}
            </div>
        </>
    );
}
