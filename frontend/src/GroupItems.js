import Button from "@material-ui/core/Button";
import React, { Component } from 'react';

class GroupItems extends Component {
    constructor(props) {
        super(props);

        this.buttonizeGroup = this.buttonizeGroup.bind(this);
    }
    

    buttonizeGroup(group) {
        return <Button type="submit"  variant="contained" color="primary">
                {group.groupName}
               </Button>
    }

    render() {
        var groupEntries = this.props.entries;
        var groupListItems = groupEntries.map(this.buttonizeGroup);

        return (
            <ul className="groupList"> 
                  {groupListItems}
            </ul>
            );
    }
}

export default GroupItems;