export default function ChatMessage({ chatMessage }) {
    return (
        <>
            <div className="chatMessage">
                <div className="messagePic">
                    <img
                        src={
                            chatMessage.url ||
                            "https:/s3.amazonaws.com/spicedling/-E2SRd1Y-R4G67_JbXqfpMtcmerzTutu.png"
                        }
                        alt={chatMessage.first}
                    ></img>
                </div>
                <div className="text">
                    <p key={chatMessage.id}>
                        {chatMessage.first} {chatMessage.last}{" "}
                        {chatMessage.timestamp}
                    </p>

                    <p>{chatMessage.message}</p>
                </div>
            </div>
        </>
    );
}
