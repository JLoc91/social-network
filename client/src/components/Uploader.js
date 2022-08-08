import React, { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log("uploader mounted!");
    }

    render() {
        return (
            <div id="transparentCover">
                <div id="popUp" className="imagebox shadow">
                    <h3 id="closeButton" onClick={this.props.togglePopup}>
                        CLOSE
                    </h3>
                    {/* <form action="/image" method="post"> */}
                    <form
                        action="/image"
                        method="post"
                        encType="multipart/form-data"
                    >
                        <div className="form-row shadow">
                            <input type="file" name="photo" id="photo"></input>
                            <input type="submit" name="Upload!"></input>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
