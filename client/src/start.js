import ReactDOM from "react-dom";
import Welcome from "./components/Welcome";

// ReactDOM.render(<Welcome />, document.querySelector("main"));

// function HelloWorld() {
//     return <div>{Welcome}</div>;
//     // return <div>Hello, World!</div>;
// }

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            ReactDOM.render(
                <img
                    className="loggedIn"
                    src="https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="logo"
                ></img>,
                document.querySelector("main")
            );
        }
    })
    .catch(() => {
        ReactDOM.render(<Welcome />, document.querySelector("main"));
    });
