import ChatMessage from "./ChatMessage";

export default function ChatBoard(chatMessages) {
    console.log("messages in ChatBoard: ", chatMessages);
    const chatMessagesArray = chatMessages.messages;
    console.log(
        "Array.isArray(chatMessagesArray): ",
        Array.isArray(chatMessagesArray)
    );
    // if (!chatMessagesArray) {
    //     return null;
    // }

    return (
        <>
            <div className="chatBoard">
                <div className="chatMessages">
                    {chatMessagesArray &&
                        chatMessagesArray.map((chatMessage) => {
                            console.log("chatMessage in loop: ", chatMessage);
                            return <ChatMessage
                                key={Math.random()}
                                chatMessage={chatMessage}
                            />;
                        })}
                </div>
            </div>
        </>
    );
}
