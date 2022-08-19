import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { receiveChatMessages } from "../../redux/Messages/slice";
import ChatInput from "./ChatInput";
import ChatBoard from "./ChatBoard";
import OnlinePeople from "./OnlinePeople";

export default function Chat() {

    const chatMessages = useSelector((state) => state.messageList);


    // useEffect(() => {
    //     (async () => {
    //         console.log("render Messages");
    //         const res = await fetch(`/api/getChatMessages`);
    //         const data = await res.json();
    //         console.log("data from getChatMessages: ", data);
    //         const alteredData = { messages: data };
    //         // STEP 5!!!!
    //         dispatch(receiveChatMessages(alteredData));
    //     })();
    //     // }
    // }, []);

    return (
        <div className="chat">
            <OnlinePeople />
            <h1>Chat works</h1>
            <ChatBoard messages={chatMessages} />
            <ChatInput />
        </div>
    );
}
