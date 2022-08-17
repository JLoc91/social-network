export default function messages(messages = {}, action) {
    console.log("messages: ", messages);
    if (action.type === "chat-messages/received") {
        messages = action.payload.messages;
    }

    console.log("messages after action: ", messages);
    return messages;
}

//STEP 6
export function receiveChatMessages(chatMessages) {
    return {
        type: "chat-messages/received",
        payload: { chatMessages },
    };
}

