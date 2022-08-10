import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            view: 1,
        };
        this.onFormInputChange = this.onFormInputChange.bind(this);
        this.onCodeFormSubmit = this.onCodeFormSubmit.bind(this);
        this.onResetFormSubmit = this.onResetFormSubmit.bind(this);
        this.startResetPassword = this.startResetPassword.bind(this);
        this.currentView = this.currentView.bind(this);
    }

    onFormInputChange(e) {
        const target = e.currentTarget;
        console.log("target.value: ", target.value);

        this.setState({
            [target.name]: target.value,
        });
        console.log("[target.name]: ", [target.name]);
    }

    onCodeFormSubmit(e) {
        e.preventDefault();
        console.log("try to submit sendcode form");
        const userData = {
            email: this.state.email,
            code: this.state.code,
        };
        console.log("userData in sendcode: ", userData);
        fetch("/api/sendCode", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((data) => {
                this.startResetPassword();
                console.log("this.state.view: ", this.state.view);
                console.log("this.state.email: ", this.state.email);
                console.log("this.state.code: ", this.state.code);
                console.log("userData.code: ", userData.code);
                console.log("data.code: ", data.code);
                // this.setState({this.state.code: data.code});
                console.log("data at client from server: ", data);
            })
            .catch((err) => {
                console.log("err in reset fetch: ", err);
                location.href = "/sendCode";
            });
    }
    onResetFormSubmit(e) {
        e.preventDefault();
        console.log("try to submit reset form");
        const userData = {
            email: this.state.email,
            code: this.state.code,
            newPassword: this.state.newPassword,
        };
        console.log("userData in Reset: ", userData);
        fetch("/api/reset-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((data) => {
                this.endResetPassword();
                console.log("this.state.view: ", this.state.view);
                console.log("this.state.email: ", this.state.email);
                console.log("this.state.code: ", this.state.code);
                console.log("userData.code: ", userData.code);
                console.log("data.code: ", data.code);

                // if (!data.userid) {
                //     console.log("stay at /reset-password");
                //     throw console.error("Credentials not correct");
                // } else {
                //     console.log("move to / ");
                //     location.href = "/";
                // }
            })
            .catch((err) => {
                console.log("err in reset fetch: ", err);
                location.href = "/sendCode";
            });
    }

    startResetPassword() {
        this.setState({ view: 2 });
    }

    endResetPassword() {
        this.setState({ view: 3 });
    }

    currentView() {
        console.log("this.state.view: ", this.state.view);
        if (this.state.view === 1) {
            //first view
            // console.log("this.state.code in 1st view: ", this.state.code);

            return (
                <>
                    <h2>Reset your password</h2>
                    <br></br>
                    <form id="reset" onSubmit={this.onCodeFormSubmit}>
                        {/* <label htmlFor="email">Email: </label> */}
                        <input
                            key={1}
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={this.state.email}
                            onChange={this.onFormInputChange}
                        ></input>
                        <p></p>
                        <button type="submit">Submit</button>
                    </form>
                    <br></br>
                    <span>
                        <Link to="/login">Back to Log in!</Link>
                    </span>
                </>
            );
        } else if (this.state.view === 2) {
            //Second view
            // console.log("this.state.code in 2nd view: ", userData.code);
            return (
                <>
                    <h2>Reset your password</h2>
                    <br></br>
                    <form id="enterCode" onSubmit={this.onResetFormSubmit}>
                        {/* <label htmlFor="code">Code: </label> */}
                        <input
                            key={2}
                            type="text"
                            name="code"
                            placeholder="Code"
                            value={this.state.code}
                            onChange={this.onFormInputChange}
                        ></input>
                        <p></p>

                        {/* <label htmlFor="newPassword">New Password: </label> */}
                        <input
                            key={3}
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            value={this.state.newPassword}
                            onChange={this.onFormInputChange}
                        ></input>
                        <p></p>
                        <button type="submit">Submit</button>
                    </form>
                    <br></br>

                    <span>
                        <Link to="/login">Back to Log in!</Link>
                    </span>
                </>
            );
        } else if (this.state.view === 3) {
            // third view
            return (
                <>
                    <h2>Password successfully changed!</h2>
                    <span>
                        <Link to="/login">Click here to Log in!</Link>
                    </span>
                </>
            );
        }
    }

    render() {
        return (
            <>
                <div>{this.currentView()}</div>
            </>
        );
    }
}

export default ResetPassword;
