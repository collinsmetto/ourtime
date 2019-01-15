import Button from "@material-ui/core/Button";
import React, { Component } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class GroupItems extends Component {
    constructor(props) {
        super(props);

        this.buttonizeGroup = this.buttonizeGroup.bind(this);
        this.showSingleGroup = this.showSingleGroup.bind(this);
    }

    // showSingGroupTimes(e) {
    //     e.preventDefault();

    //     const { setSingGroup } = this.props;

    //     setSingGroup(e.id)

    // }
    showSingleGroup(groupID, e) {
        e.preventDefault();

        const { viewSingleGroup } = this.props;
        
        console.log("SingleGroup Group ID: " + groupID);
        viewSingleGroup(groupID);
    }
    
    // For each group, creates a form containing button that calls setSingGroup(groupID)
    buttonizeGroup(group) {
        //console.log(group.ID, group.name);
        return( 
            // this.viewSingleGroup.bind(this, group.ID)
            
            <form fullWidth={true} key={group.ID} onSubmit={this.showSingleGroup.bind(this, group.groupId)}>
            <CopyToClipboard text={group.ID}>
            <Button 
                type="submit" 
                fullWidth="true" 
                variant="contained" 
                color="primary"
                id={group.ID}>

                {group.groupName} : {group.groupId}
            </Button>
            </CopyToClipboard>
            </form>);
    }

    render() {
        const {groups} = this.props;
        
        

        const groupList = [];
        // for (var group in groups)
        // {
        //     console.log("Group: " + group);
        //     groupList.push(this.buttonizeGroup(group));
        // }
        //console.log("Groups in groupList:", groups);
        Object.keys(groups).forEach(function(key) {
            groupList.push(this.buttonizeGroup(groups[key]));
            //console.log(groups[key].events);
        }.bind(this));
        

        return (
            <ul className="groupList" style={{padding:"10px"}}> 
                  {groupList}
            </ul>
            );
    }
}

export default GroupItems;