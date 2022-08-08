import { Component } from "react";
import Logo from "./Logo";
import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPopupOpen: false,
            url: "",
            first: "",
            last: "",
        };
        this.togglePopup = this.togglePopup.bind(this);
        this.changeUrl = this.changeUrl.bind(this);
    }

    componentDidMount() {
        console.log("Component Mounted");
        fetch("/userData")
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);
                this.changeUrl(data.url, data.first, data.last);
                // fetch informartion from the server
            });
    }

    changeUrl(newUrl, newFirst, newLast) {
        this.setState({ url: newUrl, first: newFirst, last: newLast });
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
                    url={this.state.url}
                    first={this.state.first}
                    last={this.state.last}
                />
                {this.state.isPopupOpen && (
                    <Uploader
                        url={this.state.url}
                        togglePopup={this.togglePopup}
                        changeUrl={this.changeUrl}
                    />
                )}
                {/* <h1>Hello from App</h1> */}
            </div>
        );
    }
}
