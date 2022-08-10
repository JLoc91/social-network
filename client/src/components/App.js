import { Component } from "react";
import Logo from "./Logo";
import Profile from "./Profile";
import OtherProfile from "./OtherProfile";
import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";
import FindPeople from "./FindPeople";
import { BrowserRouter, Route, Link } from "react-router-dom";

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
        fetch("/api/userData")
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
                <BrowserRouter>
                    <div>
                        <Route exact path="/">
                            <div className="profileHeader">
                                <div className="logoApp">
                                    <Logo />
                                </div>
                                <Link to="/users">Look for new People!</Link>
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
                        </Route>
                        <Route exact path="/users">
                            <div className="profileHeader">
                                <div className="logoApp">
                                    <Logo />
                                </div>
                                <Link to="/">Back to Profile</Link>
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
                                <FindPeople />
                            </div>
                        </Route>
                        <Route path="/user/:userId">
                            <div className="profileHeader">
                                <div className="logoApp">
                                    <Logo />
                                </div>
                                <Link to="/users">Look for new People!</Link>
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
                                <OtherProfile />
                            </div>
                        </Route>
                    </div>
                </BrowserRouter>
            </>
        );
    }
}
