export default function messages(messages = [], action) {
    if (action.type === "chat-messages/received") {
        messages = action.payload;
    }

    if (action.type === "chat-messages/send") {
        messages = [...messages, action.payload];
    }

    return messages;
}

//STEP 6
export function receiveChatMessages(chatMessages) {
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
