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
        return <div>Hi {this.props.username} !!!</div>;
        // Here you will need to create a form to send a image file, just like in the Image Board
    }
}
