export default function messages(messages = [], action) {
    console.log("messages STEP7: ", messages);
    if (action.type === "chat-messages/received") {
        messages = action.payload;
        console.log("messages STEP7 after: ", messages);
    }

    if (action.type === "chat-messages/send") {
        console.log("Array.isArray(messages): ", Array.isArray(messages));
        console.log(
            "Array.isArray([...messages]): ",
            Array.isArray([...messages])
        );
        console.log(
            "Array.isArray(action.payload): ",
            Array.isArray(action.payload)
        );
        messages = [...messages, action.payload];
        
    }
    console.log("messages after action: ", messages);
    return messages;
}

//STEP 6
export function receiveChatMessages(chatMessages) {
    console.log("chatMessages in STEP6: ", chatMessages);
    return {
        type: "chat-messages/received",
        payload: chatMessages,
    };
}

export function sendMessage(chatMessage) {
    return {
        type: "chat-messages/send",
        payload: chatMessage,
    };
}
