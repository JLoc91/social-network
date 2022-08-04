import { Component } from "react";
import Registration from "./Registration";
import Login from "./Login";
import { BrowserRouter, Route, Link } from "react-router-dom";

class Welcome extends Component {
    render() {
        return (
            <>
                <h1>Welcome!</h1>
                <img src="https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"></img>
                <br></br>
                <BrowserRouter>
                    <div>
                        <Route exact path="/">
                            <Registration />
                        </Route>
                        <Route exact path="/login">
                            <Login />
                        </Route>
                    </div>
                </BrowserRouter>
                {/* <Registration /> */}
            </>
        );
    }
}

export default Welcome;
