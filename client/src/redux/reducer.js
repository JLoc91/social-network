import { combineReducers } from "redux";
// you need to import your friendsWannabesReducer here!
import friendsWannabesReducer from "./Friends/slice";
//part10
import messagesReducer from "./Messages/slice";

// STEP 7
const rootReducer = combineReducers({
    friendsList: friendsWannabesReducer,
    //part 10
    messageList: messagesReducer,
});

export default rootReducer;
