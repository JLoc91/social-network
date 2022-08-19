import ChatMessage from "./ChatMessage";


export default function ChatBoard(chatMessages) {

    const chatMessagesArray = chatMessages.messages;
    return (
        <>
            <div className="chatBoard">
                <div className="chatMessages">
                    {chatMessagesArray &&
                        chatMessagesArray.map((chatMessage) => {
                            return (
                                <ChatMessage
                                    key={Math.random()}
                                    chatMessage={chatMessage}
                                />
                            );
                        })}
                </div>
            </div>
        </>
    );
}
