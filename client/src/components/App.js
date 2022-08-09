import { Component } from "react";
import Logo from "./Logo";
import Profile from "./Profile";
import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPopupOpen: false,
            url: "testUrl",
            first: "testFirst",
            last: "testLast",
            bio: "testBio",
        };
        this.togglePopup = this.togglePopup.bind(this);
        this.changeUrl = this.changeUrl.bind(this);
        this.changeBio = this.changeBio.bind(this);
    }

    componentDidMount() {
        console.log("Component Mounted");
        fetch("/userData")
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);
                this.changeUrl(data.url, data.first, data.last, data.bio);
            });
    }

    changeUrl(newUrl, newFirst, newLast, newBio) {
        this.setState({
            url: newUrl,
            first: newFirst,
            last: newLast,
            bio: newBio,
        });
    }

    changeBio(newBio) {
        this.setState({ bio: newBio });
    }

    togglePopup() {
        this.setState({ isPopupOpen: !this.state.isPopupOpen });
    }

    render() {
        return (
            <>
                <div className="profileHeader">
                    <Logo />
                    <ProfilePic
                        togglePopup={this.togglePopup}
                        url={this.state.url}
                        first={this.state.first}
                        last={this.state.last}
                        bio={this.state.bio}
                    />

                    {this.state.isPopupOpen && (
                        <Uploader
                            url={this.state.url}
                            togglePopup={this.togglePopup}
                            changeUrl={this.changeUrl}
                        />
                    )}
                </div>
                <div className="profileBody">
                    <Profile
                        togglePopup={this.togglePopup}
                        url={this.state.url}
                        first={this.state.first}
                        last={this.state.last}
                        bio={this.state.bio}
                        changeBio={this.changeBio}
                    />
                </div>
            </>
        );
    }
}
