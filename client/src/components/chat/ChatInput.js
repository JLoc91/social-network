import { useRef } from "react";
import { socket } from "../../socket";

export default function ChatInput() {
    const textareaRef = useRef();

    const sendMessage = () => {
        const message = textareaRef.current.value;
        console.log("message: ", message);
        socket.emit("new-message", {
            messageText: message,
        });

        textareaRef.current.value = "";
        textareaRef.current.focus();
    };

    const onChange = (e) => {
        console.log("e.keyCode: ", e.keyCode);
        if (e.keyCode == 13 && !e.shiftKey) {
            sendMessage();
        }
    };

    return (
        <div className="chatInput">
            <textarea
                ref={textareaRef}
                // placeholder={textPlaceholder}
                onKeyUp={onChange}
            ></textarea>
            <button onClick={sendMessage}>Send Message</button>
        </div>
    );
}
