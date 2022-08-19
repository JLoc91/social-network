export default function onlinePeople(onlinePeople = {}, action) {
    console.log("onlinePeople in Reducer before: ", onlinePeople);
    if (action.type === "online-people/update") {
        console.log("onlinePeople in Reducer in action: ", onlinePeople);
        console.log("action.payload: ", action.payload);
        onlinePeople = action.payload;
    }

    console.log("onlinePeople in Reducer after: ", onlinePeople);
    return onlinePeople;
}

//STEP 6

export function updateOnlinePeople(onlinePeople) {
    return {
        type: "online-people/update",
        payload: onlinePeople,
    };
}
