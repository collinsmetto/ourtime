import React, { Component } from "react";
import "./AddGroupMenu.css";
import RaisedButton from "@material-ui/core/Button";
import Input from '@material-ui/core/TextField';


class AddGroupMenu extends Component {

    /* // Test of edit group functions; Would be put in child component
    var testName = "test";

    var groupMembers = "hello, moto, how, are, you";
    var testEmails = new Set(groupMembers.replace(/\s+/g, '').split(","));
    
    var testID = 21;

    console.log("Empty group: " + this.state.groups);

    this.addGroup(testName, testEmails, testID);
    console.log("New group: " + this.state.groups);

    this.updateGroup(this.state.groups.testID, 
      new Set(["hello", "I", "am"]), new Set());
    console.log("Should be: hello moto how are you I am. \n Is: " + this.state.groups)

    this.updateGroup(this.state.groups.testID,
      new Set(), new Set(["apples", "hello", "I", "am"]));
    console.log("Should be: moto how are you. \n Is: " + this.state.groups)

    this.deleteGroup(testID);
    console.log("Groups deleted:" + this.state.groups);
    */

   constructor(props, context) {
    super(props, context);
    
    this.state = {
        createGroupName: '',
        createGroupEmails: new Set(),

        deleteGroupID: '',

        updateGroupID: '',
        updateGroupAdd: new Set(),
        updateGroupRemove: new Set()
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitCreateGroup = this.submitCreateGroup.bind(this);
    this.submitDeleteGroup = this.submitDeleteGroup.bind(this);
    this.submitUpdateGroup = this.submitUpdateGroup.bind(this);

    this.createGroup = this.createGroup.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.updateGroup = this.updateGroup.bind(this);
    }

    handleChange(e) {
        if (e.target.isset)
            this.setState({[e.target.name]:
                new Set(e.target.value.replace(/\s+/g, '').split(","))});
        else
            this.setState({ [e.target.name]: e.target.value})
    }

    createGroup(groupName, groupEmails, groupID) {
        const { createGroup } = this.props;

        //console.log(createNewGroup);
        
        createGroup(groupName, groupEmails, groupID);
    }

    submitCreateGroup(e) {
        e.preventDefault();


        const { createGroupName } = this.state;
        const { createGroupEmails } = this.state;

        if ((createGroupName !== "") & (createGroupEmails !== "")) {

        //console.log(createGroupName);
        //console.log(createGroupEmails);

        const groupID = Date.now();
        if (typeof this.createGroup === 'function' )
            this.createGroup(createGroupName, createGroupEmails, groupID);
        else 
            console.log('createNewGroup not a function??');

        this.setState({ createGroupName: '', createGroupEmails: '' });
        }
    }

    deleteGroup(groupID) {
        const { deleteGroup } = this.props;

        //console.log(createNewGroup);
        
        deleteGroup(groupID);
    }

    submitDeleteGroup(e) {
        e.preventDefault();

        const { deleteGroupID } = this.state;

        //const { deleteGroup } = this.props;

        this.deleteGroup(deleteGroupID);

        this.setState({ deleteGroupID: ''})
    }

    updateGroup(groupID, newMembers, oldMembers) {
        const { updateGroup } = this.props;

        //console.log(createNewGroup);
        
        updateGroup(groupID, newMembers, oldMembers);
    }

    submitUpdateGroup(e) {
        e.preventDefault();

        const { updateGroupID } = this.state;
        const { updateGroupAdd } = this.state;
        const { updateGroupRemove } = this.state;

        //const { updateGroup } = this.props;

        if((updateGroupID !== "") & ((updateGroupAdd !== "") | (updateGroupRemove !== ""))){
            this.updateGroup(updateGroupID, 
                updateGroupAdd, updateGroupRemove);

            this.setState({ updateGroupID: '', updateGroupAdd: '', updateGroupRemove: ''});
        }
    }

    render() {
        //console.log("Rendering: Menu");
        var visibility = "hide";

        if (this.props.menuVisibility) {
            visibility="show";
        }

        // var data = this.props.currData;

        return (
            <div id="flyoutMenu" 
                //onMouseDown={this.props.handleMouseDown}
                className={visibility}>

                <RaisedButton 
                    variant="contained" color="primary" fullWidth={true}
                    onClick={this.props.handleMousesDown}> Exit
                </RaisedButton>
                {/* <ul>
                {data.length <= 0
                    ? "NO DB ENTRIES YET"
                    : data.map(dat => (
                        <li style={{ padding: "10px" }} key={data.message}>
                        <span style={{ color: "gray" }}> id: </span> {dat.id} <br />
                        <span style={{ color: "gray" }}> data: </span>
                        {dat.message}
                        </li>
                    ))}
                </ul> */}

                <div style={{ padding: "10px" }}>
                    <form onSubmit={this.submitCreateGroup}>
                    <Input
                        type="text"
                        name="createGroupName"
                        isset={false}
                        onChange={this.handleChange}
                        label="Group Nickname"
                        //style={{ width: "200px" }}
                        fullWidth={true}
                        // inputRef={(a) => this._inputElement = a}
                    />
                    <Input
                        type="text"
                        name="createGroupEmails"
                        isset={true}
                        onChange={this.handleChange}
                        label="Emails"
                        helperText="Ex: email1@gmail.com, email2@gmail.com"
                        fullWidth={true}
                        // inputRef={(a) => this._inputElement = a}
                    />


                    <RaisedButton 
                        fullWidth={true}
                        type="submit">
                        Create Group
                    </RaisedButton>
                    </form>
                </div>

                <div style={{ padding: "10px" }}>
                    <form onSubmit={this.submitDeleteGroup}>
                    <Input
                        type="text"
                        name="deleteGroupID"
                        isset={false}
                        fullWidth={true}
                        onChange={this.handleChange}
                        label="Group ID"
                    />
                    <RaisedButton 
                        fullWidth={true}
                        type="submit"
                        //onClick={() => deleteGroup(this.state.deleteGroupID)}
                        >
                        Delete Group
                    </RaisedButton>
                    </form>
                </div>

                <div style={{ padding: "10px" }}>
                    <form onSubmit={this.submitUpdateGroup}>
                    <Input
                        type="text"
                        name="updateGroupID"
                        isset={false}
                        fullWidth={true}
                        onChange={this.handleChange}
                        label="Group ID"
                    />
                    <Input
                        type="text"
                        name="updateGroupAdd"
                        isset={true}
                        fullWidth={true}
                        onChange={this.handleChange}
                        label="Add Members"
                    />
                    <Input
                        type="text"
                        name="updateGroupRemove"
                        isset={true}
                        fullWidth={true}
                        onChange={this.handleChange}
                        label="Remove Members"
                    />
                    <RaisedButton   
                        fullWidth={true}
                        type="submit"
                    > Update Existing Group
                    </RaisedButton>
                    </form>
                </div>
            </div>
        );
    }
}

export default AddGroupMenu