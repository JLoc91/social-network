import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { receiveChatMessages } from "../../redux/Messages/slice";

export default function Chat() {
    const dispatch = useDispatch();

    return <h1>Chat works</h1>;
}
