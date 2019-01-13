import React, { Component } from "react";
import AddGroupMenuButton from "./AddGroupMenuButton";
import RaisedButton from "@material-ui/core/Button";
import AddGroupMenu from "./AddGroupMenu";
//import NewGroupQuery from "./NewGroupQuery";

class AddGroupMenuContainer extends Component {
    constructor(props, context) {
        super(props, context);
        
        this.state = {
            visible: false
        }   

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);

    }

    handleMouseDown(e) {
        e.preventDefault();
        //if (e.className === "New Group"){
        this.toggleMenu();
        //}
        // else if (e.className === "View All Times"){

        // }

        console.log("clicked");
        e.stopPropagation();

    }

    toggleMenu() {
        this.setState(
            {
                visible: !this.state.visible
            }
        );
    }

    render() {
        var data = this.props.data;

        return (
            <div>
            
            <AddGroupMenu handleMousesDown={this.handleMouseDown}
                  menuVisibility={this.state.visible}
                  currData={this.props.data}
                  createGroup={this.props.createGroup}
                  deleteGroup={this.props.deleteGroup}
                  updateGroup={this.props.updateGroup}/>

            <form onSubmit={this.handleMouseDown}>
            <RaisedButton 
                type="submit"  variant="contained" color="primary" fullWidth="true"> Edit Groups
            </RaisedButton>
            </form> 
            
            </div>
        );
    }
}

export default AddGroupMenuContainer;