import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            email: "",
            password: "",
            code: "",
            isUserLoggedIn: false,
            // error: {
            //     first: false,
            //     last: false,
            //     email: false,
            //     password: false
            // }
        };
        this.onFormInputChange = this.onFormInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onFormInputChange(e) {
        const target = e.currentTarget;
        console.log("target.value: ", target.value);

        this.setState({
            [target.name]: target.value,
        });
        console.log("[target.name]: ", [target.name]);
    }

    onFormSubmit(e) {
        e.preventDefault();
        console.log("try to submit login form");
        const userData = {
            first: this.state.first,
            last: this.state.last,
            email: this.state.email,
            password: this.state.password,
        };
        console.log("userData in Login: ", userData);
        fetch("/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((data) => {
                // if (data.error) {
                //     console.log("data.error: ", data.error);
                // }

                console.log("data at client from server: ", data);
                if (!data.userid) {
                    console.log("stay at /login");
                    throw console.error("Credentials not correct");
                } else {
                    console.log("move to / ");
                    location.href = "/";
                }
            })
            .catch((err) => {
                console.log("err in login fetch: ", err);
                location.href = "/login";
            });
    }

    render() {
        return (
            <>
                <span>Login Here!</span>

                <form id="login" onSubmit={this.onFormSubmit}>
                    <label htmlFor="email">Email: </label>
                    <input
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.onFormInputChange}
                    ></input>
                    <br></br>
                    <label htmlFor="password">Password: </label>
                    <input
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.onFormInputChange}
                    ></input>
                    <br></br>
                    <button type="submit" onClick={this.onFormSubmit}>
                        Login
                    </button>
                    <br></br>
                </form>

                <p></p>
                <span>
                    Forgot your password?
                    <Link to="/reset-password">
                        Click here to reset your password!
                    </Link>
                </span>
                <p></p>
                <span>
                    Not registered yet?
                    <Link to="/">Click here to Register!</Link>
                </span>
            </>
        );
    }
}

export default Login;
