// client/src/socket.js

import { io } from "socket.io-client";
import { receiveChatMessages, sendMessage } from "./redux/Messages/slice";
import { updateOnlinePeople } from "./redux/OnlinePeople/slice";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("last-10-messages", (messages) => {
            // messages should be an array
            console.log("got last 10 messages:", messages);
            //Step 5!
            store.dispatch(receiveChatMessages(messages));
        });

        socket.on("add-new-message", (message) => {
            store.dispatch(sendMessage(message));
        });

        socket.on("update-online-people", (onlinePeople) => {
            // console.log("onlinePeople in spcket.js: ", onlinePeople);
            store.dispatch(updateOnlinePeople(onlinePeople));
        });
    }
};
