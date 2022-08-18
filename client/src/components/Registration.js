import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

class Registration extends Component {
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
     

        this.setState({
            [target.name]: target.value,
        });
      
    }

    onFormSubmit(e) {
        e.preventDefault();
      
        const userData = {
            first: this.state.first,
            last: this.state.last,
            email: this.state.email,
            password: this.state.password,
        };
 
        fetch("/api/register", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((id) => {
             
                location.reload();
            })
            .catch((err) => console.log("err in registration fetch: ", err));
    }

    render() {
        return (
            <>
                <span>Register Here!</span>

                <form id="registration" onSubmit={this.onFormSubmit}>
                    <br></br>
                    {/* <label htmlFor="first">First Name: </label> */}
                    <input
                        type="text"
                        name="first"
                        placeholder="First Name"
                        value={this.state.first}
                        onChange={this.onFormInputChange}
                    ></input>
                    <br></br>
                    {/* <label htmlFor="last">Last Name: </label> */}
                    <input
                        type="text"
                        name="last"
                        placeholder="Last Name"
                        value={this.state.last}
                        onChange={this.onFormInputChange}
                        // className={this.state.errors.last ? "error"}
                    ></input>
                    <br></br>
                    {/* <label htmlFor="email">Email: </label> */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.onFormInputChange}
                    ></input>
                    <br></br>
                    {/* <label htmlFor="password">Password: </label> */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.onFormInputChange}
                    ></input>
                    <br></br>
                    <button type="submit" onClick={this.onFormSubmit}>
                        Register
                    </button>
                    <br></br>
                </form>

                <br></br>

                <span>
                    Already a Member?
                    <Link to="/login">Click here to Log in!</Link>
                </span>
            </>
        );
    }
}

export default Registration;
