export default function friendAndWannabes(friends = [], action) {
    if (action.type === "friends-and-wannabes/received") {
        friends = action.payload.friendsAndWannabe;
    }

    // if (action.type === "friends-and-wannabes/accept") {
    //     const newFriends = [];
    //     friends.map(/** do something with action.payload.id... */);
    //     return newFriends;
    // }

    // if (action.type === "friends-and-wannabes/unfriend") {
    //     return;
    // }

    return friends;
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
        type: "/friends-and-wannabes/accept",
        payload: { id },
    };
}

export function unfriend(id) {
    return {
        type: "/friends-and-wannabes/unfriend",
        payload: { id },
    };
}
