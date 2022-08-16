export default function friendAndWannabes(friendsAndWannabe = {}, action) {
    console.log("friendsAndWannabe: ", friendsAndWannabe);
    if (action.type === "friends-and-wannabes/received") {
        friendsAndWannabe = action.payload.friendsAndWannabe;
    }

    if (action.type === "friends-and-wannabes/accept") {
        const friendships = friendsAndWannabe.friendships.map((friend) => {
            console.log("friend: ", friend);
            if (friend.id === action.payload.id) {
                console.log("it's a match!");
                console.log("{...friend}: ", { ...friend });
                return {
                    ...friend,
                    accepted: true,
                };
            } else {
                return friend;
            }
        });
        friendsAndWannabe = { ...friendsAndWannabe, friendships };
    }

    if (action.type === "friends-and-wannabes/unfriend") {
        const friendships = [];
        friendsAndWannabe.friendships.map((friend) => {
            console.log("friend: ", friend);
            if (friend.id !== action.payload.id) {
                friendships.push(friend);
            }
        });
        friendsAndWannabe = { ...friendsAndWannabe, friendships };
    }

    console.log("friendsAndWannabe after action: ", friendsAndWannabe);
    return friendsAndWannabe;
}

// Creators of actions
// You need 3 action creators, one for each type (as above)
// 1. use it to update the state with data from the server.
//    payload: all friends, from the server
// 2. payload: id of the friend we're accepting
// 3. payload: id of the friend we're unfriending

//STEP 6
export function receiveFriendsAndWannabes(friendsAndWannabe) {
    // console.log("data in receiveFriendsANdwannabes: ", friendsAndWannabe);
    return {
        type: "friends-and-wannabes/received",
        payload: { friendsAndWannabe },
    };
}

export function acceptFriend(id) {
    return {
        type: "friends-and-wannabes/accept",
        payload: { id },
    };
}

export function unfriend(id) {
    return {
        type: "friends-and-wannabes/unfriend",
        payload: { id },
    };
}
