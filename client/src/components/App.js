import { Component } from "react";
import Logo from "./Logo";
import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPopupOpen: false,
            username: "Buckwheat",
        };
        this.togglePopup = this.togglePopup.bind(this);
        this.changeName = this.changeName.bind(this);
    }

    componentDidMount() {
        console.log("Component Mounted");
        // fetch informartion from the server
    }

    changeName(newName) {
        this.setState({ username: newName });
    }

    togglePopup() {
        this.setState({ isPopupOpen: !this.state.isPopupOpen });
    }

    // imgFromApp() {
    //     return d;
    // }

    render() {
        return (
            <div className="profileHeader">
                <Logo />
                <ProfilePic
                    togglePopup={this.togglePopup}
                    changeName={this.changeName}
                    imgFromApp={this.imgFromApp}
                />
                {this.state.isPopupOpen && (
                    <Uploader
                        username={this.state.username}
                        togglePopup={this.togglePopup}
                    />
                )}
                {/* <h1>Hello from App</h1> */}
            </div>
        );
    }
}
