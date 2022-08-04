import { Component } from "react";

class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            view: 1,
        };
        this.onFormInputChange = this.onFormInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
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

    onFormSubmit(e) {
        e.preventDefault();
        console.log("try to submit reset form");
        const userData = {
            email: this.state.email,
            code: this.state.code,
        };
        console.log("userData in Reset: ", userData);
        fetch("/sendCode", {
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
                console.log("data at client from server: ", data);
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

    currentView() {
        console.log("this.state.view: ", this.state.view);
        if (this.state.view === 1) {
            //first view
            return (
                <>
                    <h2>Reset your password</h2>
                    <form id="reset" onSubmit={this.onFormSubmit}>
                        <label htmlFor="email">Email: </label>
                        <input
                            type="email"
                            name="email"
                            value={this.state.email}
                            onChange={this.onFormInputChange}
                        ></input>
                        <p></p>
                        <button type="submit">Submit</button>
                    </form>
                </>
            );
        } else if (this.state.view === 2) {
            //Second view
            return (
                <>
                    <h2>Reset your password</h2>
                    <form id="reset" onSubmit={this.onFormSubmit}>
                        <label htmlFor="code">Code: </label>
                        <input
                            type="number"
                            name="code"
                            value={this.state.code}
                            onChange={this.onFormInputChange}
                        ></input>
                        <p></p>
                        <button type="submit">Submit</button>
                    </form>
                </>
            );
        } else if (this.state.view === 3) {
            // third view
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
