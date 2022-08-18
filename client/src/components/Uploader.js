import React, { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onImageFormSubmit = this.onImageFormSubmit.bind(this);
    }
    componentDidMount() {
        console.log("uploader mounted!");
    }

    onImageFormSubmit(e) {
        e.preventDefault();
     
        const form = e.currentTarget;
        const fileInput = form.querySelector("input[type=file]");
      

        if (fileInput.files.length < 1) {
            alert("You must add a file!");
            return;
        }

        const formData = new FormData(form);
      
        fetch("/api/image", {
            method: "post",
            // headers: {
            //     "Content-Type": "application/json",
            // },
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
          
                this.props.changeUrl(data.url, data.first, data.last, data.bio);
                this.props.togglePopup();
            })
            .catch((err) => {
                console.log("err in image fetch: ", err);
                location.href = "/";
            });
    }

    render() {
        return (
            <div id="transparentCover">
                <div id="popUp" className="imagebox shadow">
                    <h3 id="closeButton" onClick={this.props.togglePopup}>
                        CLOSE
                    </h3>
                    <form
                        action="/api/image"
                        method="post"
                        encType="multipart/form-data"
                        onSubmit={this.onImageFormSubmit}
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
