import React, { Component } from "react";
import AddGroupMenuContainer from "./AddGroupMenu/AddGroupMenuContainer";

import RaisedButton from "@material-ui/core/Button";
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/TextField';
//import classNames from 'classnames';
import GroupList from "./GroupList";
//import GroupList from "./GroupList";
//import MenuButton from "./Button";

class MenuContainer extends Component {
    constructor () {
        super();
        this.state = {
          groups: []
        };

        this.addGroup = this.addGroup.bind(this);
      }

      addGroup(e){
        if (this._inputElement.value !== "")
        {
            var newGroup = {
                groupName: this._inputElement.value
            };

            this.setState((prevState) => {
                return {
                    groups: prevState.groups.concat(newGroup)
                };
            });

            this._inputElement.value = "";
        }

        console.log(this.state.groups);

        e.preventDefault();
      }

    // someFn = () => {
    //    // [...somewhere in here I define a variable eventsInfo which    I think will be useful as data in my ToDoList component...]
    //    var eventsInfo = ["Callback Works"] 
    //     this.props.callbackFromParent(eventsInfo);
    // }
    
    //  someFn = ({count, increaseCount}) => {
    //     return(
    //       <button onClick={() => increaseCount(count + 1)}>+</button>
    //     )
    //   };
    
    

    render() {
        // <MenuButton className="New Group"/> <GroupList/>

        return (
            <div>
                <h1>Meetups</h1>
                <br/>
                <AddGroupMenuContainer
                data={this.props.currData}
                putDataToDB={this.props.addGroupToDB}
                deleteFromDB={this.props.deleteGroupFromDB}
                updateDB={this.props.updateGroupInDB}
                />

                

                 <form onSubmit={this.addGroupToCalendar}>
                 <label>Group Members</label>
                    <GroupList entries={this.state.groups}/>
                 </form>
                    
                    
                 {/* <form onSubmit={this.addGroup}>
                     <Input
                        label="Group Emails"
                        //placeholder="Group Emails"
                        //className={classes.textField}
                        helperText="Ex: email1@example.com, email2@example.com"
                        margin="normal"
                        inputRef={(a) => this._inputElement = a}
                    />
                    <RaisedButton type="submit"  variant="contained" color="primary" fullWidth="true" >Add New Group</RaisedButton>
                </form>  */}

                <br/>

                <RaisedButton type="submit"  variant="contained" color="primary" fullWidth="true"> View All Times</RaisedButton>

            </div>
        );
    }
}

export default MenuContainer;