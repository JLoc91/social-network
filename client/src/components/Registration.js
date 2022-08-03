import { Component } from "react";

class Registration extends Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            email: "",
            password: "",
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
        console.log("try to submit form");
        // if (!this.validateFields()) {
        //     return;
        // }
        const userData = {
            first: this.state.first,
            last: this.state.last,
            email: this.state.email,
            password: this.state.password,
        };
        console.log("userData in Registration: ", userData);
        fetch("/register", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((data) => {});
    }

    // validateFields() {
    //     if()
    // }

    render() {
        return (
            <>
                <span>Register Here!</span>

                <form id="registration" onSubmit={this.onFormSubmit}>
                    <br></br>
                    <label htmlFor="first">First Name: </label>
                    <input
                        type="text"
                        name="first"
                        value={this.state.first}
                        onChange={this.onFormInputChange}
                    ></input>
                    <br></br>
                    <label htmlFor="last">Last Name: </label>
                    <input
                        type="text"
                        name="last"
                        value={this.state.last}
                        onChange={this.onFormInputChange}
                        // className={this.state.errors.last ? "error"}
                    ></input>
                    <br></br>
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
                    {/* <button type="submit" onClick={this.onFormSubmit}> */}
                    <button type="submit" onClick={this.onFormSubmit}>
                        Register
                    </button>
                    <br></br>
                </form>

                <br></br>
                <span>
                    Already a Member? <a href="/login">Login in</a>
                </span>
            </>
        );
    }
}

export default Registration;
