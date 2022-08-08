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
        return <h1>BioEditor</h1>;
        // if (this.state.isEditorVisible) {
        //     return (
        //         <>
        //             <textarea name="bio" cols="30" rows="10"></textarea>
        //             <button onClick={this.showEditor}>Cancel</button>
        //         </>
        //     );
        // } else {
        //     console.log("this.props.bio: ", this.props.bio);
        //     if (this.props.bio) {
        //         return (
        //             <>
        //                 <h2>{this.props.bio}</h2>
        //                 <button>Edit</button>
        //             </>
        //         );
        //     } else {
        //         return <button onClick={this.showEditor}>Add</button>;
        //     }
        // }
    }
}
