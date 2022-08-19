import { Component } from "react";
import Logo from "./Logo";
import Profile from "./Profile";
import OtherProfile from "./OtherProfile";
import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";
import FindPeople from "./FindPeople";
import Friends from "./Friends";
import Chat from "./chat/Chat";
import LogOutButton from "./LogOutButton";
import DeleteButton from "./DeleteButton";
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
                                <Link to="/friends">Friends</Link>
                                <Link to="/chat">Chat</Link>
                                <LogOutButton />
                                <ProfilePic
                                    togglePopup={this.togglePopup}
                                    url={this.state.url}
                                    first={this.state.first}
                                    last={this.state.last}
                                    bio={this.state.bio}
                                />

                                {this.state.isPopupOpen && (
                                    <>
                                        <div id="transparentCover">
                                            <div
                                                id="popUp"
                                                className="imagebox shadow"
                                            >
                                                <DeleteButton />
                                                <Uploader
                                                    url={this.state.url}
                                                    togglePopup={
                                                        this.togglePopup
                                                    }
                                                    changeUrl={this.changeUrl}
                                                />
                                            </div>
                                        </div>
                                    </>
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
                                <Link to="/friends">Friends</Link>
                                <Link to="/chat">Chat</Link>

                                <ProfilePic
                                    togglePopup={this.togglePopup}
                                    url={this.state.url}
                                    first={this.state.first}
                                    last={this.state.last}
                                    bio={this.state.bio}
                                />
                                {this.state.isPopupOpen && (
                                    <>
                                        <div id="transparentCover">
                                            <div
                                                id="popUp"
                                                className="imagebox shadow"
                                            >
                                                <DeleteButton />
                                                <Uploader
                                                    url={this.state.url}
                                                    togglePopup={
                                                        this.togglePopup
                                                    }
                                                    changeUrl={this.changeUrl}
                                                />
                                            </div>
                                        </div>
                                    </>
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
                                <Link to="/friends">Friends</Link>
                                <Link to="/chat">Chat</Link>
                                <ProfilePic
                                    togglePopup={this.togglePopup}
                                    url={this.state.url}
                                    first={this.state.first}
                                    last={this.state.last}
                                    bio={this.state.bio}
                                />
                                {this.state.isPopupOpen && (
                                    <>
                                        <div id="transparentCover">
                                            <div
                                                id="popUp"
                                                className="imagebox shadow"
                                            >
                                                <DeleteButton />
                                                <Uploader
                                                    url={this.state.url}
                                                    togglePopup={
                                                        this.togglePopup
                                                    }
                                                    changeUrl={this.changeUrl}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="profileBody">
                                <OtherProfile />
                            </div>
                        </Route>
                        <Route path="/friends">
                            <div className="profileHeader">
                                <div className="logoApp">
                                    <Logo />
                                </div>
                                <Link to="/users">Look for new People!</Link>
                                <Link to="/chat">Chat</Link>
                                <ProfilePic
                                    togglePopup={this.togglePopup}
                                    url={this.state.url}
                                    first={this.state.first}
                                    last={this.state.last}
                                    bio={this.state.bio}
                                />
                                {this.state.isPopupOpen && (
                                    <>
                                        <div id="transparentCover">
                                            <div
                                                id="popUp"
                                                className="imagebox shadow"
                                            >
                                                <DeleteButton />
                                                <Uploader
                                                    url={this.state.url}
                                                    togglePopup={
                                                        this.togglePopup
                                                    }
                                                    changeUrl={this.changeUrl}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="profileBody">
                                <Friends />
                            </div>
                        </Route>
                        <Route path="/chat">
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
                                    <>
                                        <div id="transparentCover">
                                            <div
                                                id="popUp"
                                                className="imagebox shadow"
                                            >
                                                <DeleteButton />
                                                <Uploader
                                                    url={this.state.url}
                                                    togglePopup={
                                                        this.togglePopup
                                                    }
                                                    changeUrl={this.changeUrl}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="profileBody">
                                <Chat />
                            </div>
                        </Route>
                    </div>
                </BrowserRouter>
            </>
        );
    }
}
