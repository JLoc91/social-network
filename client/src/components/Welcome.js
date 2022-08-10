import { Component } from "react";
import Registration from "./Registration";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import Logo from "./Logo";
import { BrowserRouter, Route, Link } from "react-router-dom";

class Welcome extends Component {
    render() {
        return (
            <>
                <div className="logoWelcome">
                    <Logo />
                </div>
                <br></br>
                <BrowserRouter>
                    <div id="welcome-container">
                        <h1>Welcome!</h1>
                        <br></br>
                        <Route exact path="/">
                            <Registration />
                        </Route>
                        <Route exact path="/login">
                            <Login />
                        </Route>
                        <Route exact path="/reset-password">
                            <ResetPassword />
                        </Route>
                    </div>
                </BrowserRouter>
            </>
        );
    }
}

export default Welcome;
