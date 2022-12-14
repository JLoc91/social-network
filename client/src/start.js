import ReactDOM from "react-dom";
import Welcome from "./components/Welcome";
import App from "./components/App";
import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./redux/reducer.js";
import { Provider } from "react-redux";
//part 10
import { init } from "./socket.js";

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

//part10


fetch("/api/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        // console.log("data.user: ", data.user);
        if (!data.userid) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            init(store);
            ReactDOM.render(
                <Provider store={store}>
                    <App />
                </Provider>,
                document.querySelector("main")
            );
        }
    });
