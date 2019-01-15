import React, { Component } from "react";
import AddGroupMenuContainer from "./AddGroupMenu/AddGroupMenuContainer";

import RaisedButton from "@material-ui/core/Button";
//import { withStyles } from '@material-ui/core/styles';
//import Input from '@material-ui/core/TextField';
//import classNames from 'classnames';
import GroupList from "./GroupList";
//import GroupList from "./GroupList";

class MenuContainer extends Component {

    constructor(props) {
        super(props);

        this.viewAllGroups = this.viewAllGroups.bind(this);
    }

    viewAllGroups(e) {
        e.preventDefault();

        const { viewAllGroups } = this.props;

        viewAllGroups();
    }
    render() {

        return (
            <div>
                {/* <h1>Meetups</h1> */}
                
                <br/>
                <AddGroupMenuContainer
                createGroup={this.props.createGroup}
                deleteGroup={this.props.deleteGroup}
                updateGroup={this.props.updateGroup}
                />

                <form onSubmit={this.addGroupToCalendar}>
                <label>Group Members</label>
                <GroupList 
                    groups={this.props.groups}
                    viewSingleGroup={this.props.viewSingleGroup}/>
                </form>
                    

                <br/>
                <form onSubmit={this.viewAllGroups}>
                <RaisedButton type="submit"  variant="contained" color="primary" fullWidth={true}> View All Times</RaisedButton>
                </form>
            </div>
        );
    }
}

export default MenuContainer;