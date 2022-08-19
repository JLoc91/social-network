import { useSelector } from "react-redux";

export default function OnlinePeople() {
    const onlinePeople = useSelector(
        (state) => state.onlinePeopleList.onlineUser
    );
    const userInfo = useSelector((state) => state.onlinePeopleList.userInfo);
    console.log("onlinePeople in onlinePeople component: ", onlinePeople);
    console.log("userInfo in onlinePeople component: ", userInfo);
    const userInfoObj = {};
    userInfo.map((obj) => {
        userInfoObj[obj.id] = obj;
    });

    console.log("userInfoObj in onlinePeople component: ", userInfoObj);
    const onlinePeopleArray = Object.keys(onlinePeople);

    return (
        <>
            <div className="onlineUserBox">
                <p>These People are currently online</p>
                <div className="onlinePeople">
                    {onlinePeopleArray.map((user) => {
                        return (
                            <div key={user} className="onlineUser">
                                <img
                                    className="small"
                                    src={
                                        userInfoObj[user].url ||
                                        "https:/s3.amazonaws.com/spicedling/-E2SRd1Y-R4G67_JbXqfpMtcmerzTutu.png"
                                    }
                                    alt={userInfoObj[user].first}
                                    onClick={() =>
                                        (location.href = `/user/${user}`)
                                    }
                                ></img>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
