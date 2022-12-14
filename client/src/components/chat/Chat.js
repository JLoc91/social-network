import { useSelector } from "react-redux";

import ChatInput from "./ChatInput";
import ChatBoard from "./ChatBoard";
import OnlinePeople from "./OnlinePeople";

export default function Chat() {
    const chatMessages = useSelector((state) => state.messageList);

    return (
        <div className="chat">
            <OnlinePeople />
            <ChatBoard messages={chatMessages} />
            <br></br>
            <ChatInput />
        </div>
    );
}
