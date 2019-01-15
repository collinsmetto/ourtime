import React, { Component } from "react";
import GroupItems from "./GroupItems";
import Input from '@material-ui/core/TextField';
import ReactSearchBox from 'react-search-box'
//import SearchBar from "./SearchBar";
//import "GroupList.css";

class GroupList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query: '',
            results: []
        };

        this.filterGroups = this.filterGroups.bind(this);
        this.viewAllGroups = this.viewAllGroups.bind(this);
    }

    groupEntries = this.props.entries;

    handleInputChange = () => {
        this.setState({
          query: this.search.value
        }, () => {
          if (this.state.query && this.state.query.length > 1) {
            if (this.state.query.length % 2 === 0) {
              this.getInfo()
            }
          } else if (!this.state.query) {
          }
        })

        this.preventDefault();
      }


    filterGroups(e){
        // Implemented with Calendar
        //console.log(this.state.freeTimes);
        const { results } = this.state;
        const { allGroups } = this.props; 

        var currGroup = this.state.groupItems.filter(function (group) {
            return (group.name === e.key)
        } );
        //results = allGroups;
    }

    viewAllGroups(e){
        //console.log(this.state.freeTimes);
        return this.props.groups;
    }
    

    render() {
        
       
        return (
            <div>
            {/* <Input 
                label="Search for Groups"
                margin="normal"
                inputRef={input => this.search = input}
                // onChange={this.handleInputChange}
                /> */}

            <GroupItems 
                groups={this.props.groups}
                viewSingleGroup={this.props.viewSingleGroup}
            />
            </div>
        );
    }
    
}

export default GroupList;