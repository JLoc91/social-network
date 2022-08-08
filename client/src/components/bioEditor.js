import React, { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = { draftBio: "", isEditorVisible: false, bio: props.bio };
        this.showEditor = this.showEditor.bind(this);
    }

    showEditor() {
        this.setState({ isEditorVisible: !this.state.isEditorVisible });
    }

    fetchNewBioToServer() {
        //POST Fetch request to server, when success, save the new Bio

        this.showEditor();
        this.props.saveDraftBioToApp(this.state.draftBio);
    }

    render() {
        return (
            <div>
                {this.state.isEditorVisible ? (
                    <>
                        <textarea name="bio" cols="30" rows="10"></textarea>
                        <button onClick={this.showEditor}>Cancel</button>
                    </>
                ) : (
                    <>
                        {this.props.bio ? (
                            <>
                                <h2>{this.props.bio}</h2>
                                <button>Edit</button>
                            </>
                        ) : (
                            <button onClick={this.showEditor}>Add</button>
                        )}
                    </>
                )}
            </div>
        );
    }
}
