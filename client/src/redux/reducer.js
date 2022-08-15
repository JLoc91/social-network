import { combineReducers } from "redux";
// you need to import your friendsWannabesReducer here!
import friendsWannabesReducer from "./Friends/slice";

const rootReducer = combineReducers({
    friendsAndWannabe: friendsWannabesReducer,
});

export default rootReducer;
