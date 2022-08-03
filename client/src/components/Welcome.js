import { Component } from "react";
import Registration from "./Registration";

class Welcome extends Component {
    render() {
        return (
            <>
                <h1>Welcome!</h1>
                <img src="https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"></img>
                <br></br>
                <Registration />
            </>
        );
    }
}

export default Welcome;
