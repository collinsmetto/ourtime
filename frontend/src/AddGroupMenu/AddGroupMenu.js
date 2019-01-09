import React, { Component } from "react";
import "./AddGroupMenu.css";
import RaisedButton from "@material-ui/core/Button";
import Input from '@material-ui/core/TextField';

class AddGroupMenu extends Component {
    render() {
        console.log("Rendering: Menu");
        var visibility = "hide";

        if (this.props.menuVisibility) {
            visibility="show";
        }

        var data = this.props.currData;
        let putDataToDB = this.props.addGroupToDB;
        let deleteFromDB = this.props.deleteGroupFromDB;
        let updateDB = this.props.updateGroupInDB;

        return (
            <div id="flyoutMenu" 
                //onMouseDown={this.props.handleMouseDown}
                className={visibility}>

                    <RaisedButton 
                        variant="contained" color="primary" fullWidth="true"
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

                <div style={{ padding: "10px" }}
                >
                <form>
                <Input
                    type="text"
                    onChange={e => this.setState({ message: e.target.value })}
                    label="Group Nickname"
                    //style={{ width: "200px" }}
                    fullWidth="true"
                    inputRef={(a) => this._inputElement = a}
                />
                <Input
                    type="text"
                    onChange={e => this.setState({ message: e.target.value })}
                    label="Emails"
                    helperText="Ex: email1@gmail.com, email2@gmail.com"
                    fullWidth="true"
                    inputRef={(a) => this._inputElement = a}
                />
                <RaisedButton 
                    fullWidth="true"
                    onClick={() => putDataToDB(this.state.message)}>
                    Add
                </RaisedButton>

                </form>
                </div>

                <div style={{ padding: "10px" }}>
                <form>
                <Input
                    type="text"
                    fullWidth="true"
                    onChange={e => this.setState({ idToDelete: e.target.value })}
                    label="Group ID"
                />
                <RaisedButton fullWidth="true" onClick={() => deleteFromDB(this.state.idToDelete)}>
                    Delete
                </RaisedButton>
                </form>
                </div>

                <div style={{ padding: "10px" }}>
                <form>
                <Input
                    type="text"
                    fullWidth="true"
                    onChange={e => this.setState({ idToUpdate: e.target.value })}
                    label="Group ID"
                />
                <Input
                    type="text"
                    fullWidth="true"
                    onChange={e => this.setState({ updateToApply: e.target.value })}
                    label="Member Emails"
                />
                <RaisedButton
                    fullWidth="true"
                    onClick={() =>
                    updateDB(this.state.idToUpdate, this.state.updateToApply)
                    }
                > Update
                </RaisedButton>
                </form>
            </div>
            </div>
        );
    }
}

export default AddGroupMenu