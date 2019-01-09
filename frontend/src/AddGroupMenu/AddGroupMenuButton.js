import React, { Component } from "react";
import RaisedButton from "@material-ui/core/Button";
import "./AddGroupMenuButton.css";

class AddGroupMenuButton extends Component{
    render()
    {
        console.log("Rendering: MenuButton");
        return (
            <RaisedButton 
                    onMouseDown={this.props.handleMouseDown} />
        );
    }
}

export default AddGroupMenuButton