import { Component } from "react";

class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            view: 1,
        };
    }

    startResetPassword() {
        this.setState({ view: 2 });
    }

    currentView() {
        if (this.state.view === 1) {
            //first view
        } else if (this.state.view === 2) {
            //Second view
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
