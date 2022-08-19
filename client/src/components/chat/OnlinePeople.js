import { useSelector } from "react-redux";

export default function OnlinePeople() {
    const onlinePeople = useSelector((state) => state.onlinePeopleList);
    console.log("onlinePeople in onlinePeople component: ", onlinePeople);
    const onlinePeopleArray = Object.keys(onlinePeople);

    return (
        <>
            <div className="onlinePeople">
                <p>These People are currently online</p>
                <div>
                    {onlinePeopleArray.map((user) => {
                        return <p key="{user}">{user}</p>;
                    })}
                </div>
            </div>
        </>
    );
}
