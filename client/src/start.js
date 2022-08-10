import ReactDOM from "react-dom";
import Welcome from "./components/Welcome";
import App from "./components/App";

fetch("/api/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        console.log("data.user: ", data.user);
        if (!data.userid) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            ReactDOM.render(<App />, document.querySelector("main"));
        }
    });
// .catch(() => {
//     ReactDOM.render(<Welcome />, document.querySelector("main"));
// });
