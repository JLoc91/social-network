import React, { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = { draftBio: "", isEditorVisible: false, bio: props.bio };
        this.showEditor = this.showEditor.bind(this);
        this.fetchNewBioToServer = this.fetchNewBioToServer.bind(this);
        this.onTextAreaInputChange = this.onTextAreaInputChange.bind(this);
        this.changeBioInBioEditor = this.changeBioInBioEditor.bind(this);
        this.deleteText = this.deleteText.bind(this);
    }

    showEditor() {
        this.setState({ isEditorVisible: !this.state.isEditorVisible });
    }

    deleteText() {
        this.showEditor();
        this.setState({ draftBio: "" });
    }

    fetchNewBioToServer(e) {
        //POST Fetch request to server, when success, save the new Bio
        e.preventDefault();
        console.log("try to submit registration form");
        const bioData = {
            draftBio: this.state.draftBio,
        };
        // console.log("bioData in FetchNewBioToServer: ", bioData);
        fetch("/api/addBio", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bioData),
        })
            .then((response) => response.json())
            .then((id) => {
                // console.log(
                //     "this.state.draftBio after updating DB: ",
                //     this.state.draftBio
                // );
                // console.log(
                //     "this.props.bio after updating DB: ",
                //     this.props.bio
                // );
                // console.log("id at client from server: ", id);
                this.props.changeBio(this.state.draftBio);
                // location.href = "/";
            })
            .catch((err) => console.log("err in registration fetch: ", err));
        this.showEditor();
        // this.props.saveDraftBioToApp(this.state.draftBio);
    }

    onTextAreaInputChange(e) {
        const target = e.currentTarget;
        // console.log("target.value: ", target.value);

        this.setState({
            draftBio: target.value,
        });
        // console.log("this.state.draftBio: ", this.state.draftBio);
    }

    changeBioInBioEditor(e) {
        e.preventDefault();
        this.showEditor();
        this.setState({ draftBio: this.props.bio });
    }

    render() {
        // this.setState({ draftBio: this.props.bio });
        if (this.state.isEditorVisible) {
            return (
                <>
                    <textarea
                        name="bio"
                        cols="30"
                        rows="10"
                        onChange={this.onTextAreaInputChange}
                        // onLoad={this.setState({ draftBio: this.props.bio })}
                        value={this.state.draftBio}
                    ></textarea>
                    <button onClick={this.deleteText}>Cancel</button>
                    <button onClick={this.fetchNewBioToServer}>Save</button>
                </>
            );
        } else {
            if (this.props.bio) {
                return (
                    <>
                        <p className="bioText">{this.props.bio}</p>
                        <button onClick={this.changeBioInBioEditor}>
                            Edit
                        </button>
                    </>
                );
            } else {
                return <button onClick={this.showEditor}>Add</button>;
            }
        }
    }
}
