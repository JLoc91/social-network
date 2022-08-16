import { combineReducers } from "redux";
// you need to import your friendsWannabesReducer here!
import friendsWannabesReducer from "./Friends/slice";

// STEP 7
const rootReducer = combineReducers({
    friendsList: friendsWannabesReducer,
});

export default rootReducer;
