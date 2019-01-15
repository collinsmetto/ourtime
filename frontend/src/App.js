import React, { Component } from 'react';
import MenuContainer from "./MenuContainer";
import Calendar from "react-big-calendar";
import moment from "moment";
import Header from './Header.js';
import "./App.css";

import axios from "axios";
import Input from "@material-ui/core/Button";
import { GoogleLogin } from 'react-google-login';
import config from './config.json';
import GroupList from './GroupList.js'
import GroupItems from './GroupItems.js'
import Event_Comp from './Event_Comp.js'


import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = Calendar.momentLocalizer(moment);

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      isAuthenticated: false,
      user: null,
      token: this.props.tokenFromLogIn,
      stateCalAllGroups: [], 
      stateCalSingleGroup: [],
      isSingleGroup: false,
      count: 0,
      groups: {},
      dbInfo: ''
    };
      
      this.createGroup = this.createGroup.bind(this);
      this.deleteGroup = this.deleteGroup.bind(this);
      this.updateGroup = this.updateGroup.bind(this);
      this.viewSingleGroup = this.viewSingleGroup.bind(this);
      this.viewAllGroups = this.viewAllGroups.bind(this);
      this.getmyFreeTime = this.getmyFreeTime.bind(this);
  }

  // TO BE DEFINED IN LOGINPAGE.JS
  logout = () => {
      this.setState({isAuthenticated: false, token: '', user: null})
  };

  onFailure = (error) => {
      alert(error);
  };


  getmyFreeTime = () => {
          
    const myHeaders = new Headers();

    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', this.state.token);

    fetch('http://localhost:4000/profile/myfreetime', {
    method: 'GET',
    headers: myHeaders,
    })
          .then(function(response) { 
          return response.json();
          })
          .then(function(myJson) {
            //console.log("in getmyFreeTime")
            //console.log(JSON.stringify(myJson.events));
            this.setState({
              stateCalAllGroups: myJson.events,
              isSingleGroup: false
            });
        }.bind(this)
        );
  }

  // Shows the free times of a singular group, given the groupID
  viewSingleGroup = (groupID) => {
    //console.log(groupID)
    //console.log("Call to view group with ID: " + groupID);
    
    var groupEvents = this.state.groups[groupID].events;
    //console.log(groupEvents);
    if (this.state.groups[groupID]) 
      this.setState({
        stateCalSingleGroup: groupEvents,
        isSingleGroup: true
      });
    //console.log(this.state.stateCalSingleGroup, this.state.isSingleGroup);
  }

  viewAllGroups = () => {
    console.log("Call to view all groups");
    var allGroupTimes = new Set();
    // for (var group in this.state.groups) {
    //   if (group.events)
    //     allGroupTimes.add(group.events);
    // }


    Object.keys(this.state.groups).forEach(function(key) {
      const groupEvents = this.state.groups[key].events;
      //console.log(groupEvents);
      if(groupEvents)
      {
        Object.keys(groupEvents).forEach(function(key){
          //console.log(groupEvents[key]);
          allGroupTimes.add(groupEvents[key]);
        })

        // for (var event in group.events)
        // {
        //   //Object.keys()
        //   console.log(event);
        //   allGroupTimes.add(event);
        // }
      }
        }.bind(this)
    );

    let allGroupTimesArray = [];
    
    allGroupTimes.forEach(v => allGroupTimesArray.push(v));
    console.log("Ideal calendar state", allGroupTimesArray);

    this.setState({
      stateCalAllGroups: allGroupTimesArray,
      isSingleGroup: false
    });

    console.log("Current Calendar State", this.state.stateCalAllGroups, this.state.isSingleGroup);

  }
  

/* Changes state of groups 
  ADD: Adds group given group nickname and a Set object of emails
  DELETE: Deletes group given groupID
  UPDATE: Updates group members given groupID, a Set object of
          emails to delete, and a Set object of emails to add */
  
  createGroup = (groupName, groupEmails, groupID) => {
    //groupID = ; // NEED TO SET TO UNIQUE NUMBER NOT IN APP (perhaps hashing of group name?)
    // id = Date.now()
    //groupEmails = new Set(groupEmails.replace(/\s+/g, '').split(","));

    var newGroup = {
      name: groupName, 
      emails: groupEmails, 
      ID: groupID
    };

    // send data to database
    const myHeaders = new Headers();

    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', this.state.token);
    myHeaders.append('groupid', newGroup.ID)
    myHeaders.append('groupname', newGroup.name)
    myHeaders.append('groupemails', newGroup.emails)
    
      fetch('http://localhost:4000/profile/creategroup', {
            method: 'GET',
            headers: myHeaders,
        })
        .then(function(response) {  
            return response.json();
        })
        .then(function(myJson) {
            console.log(JSON.stringify(myJson)); ///* myJson consists of a group: groupName,groupId,users, invalidUsers,events,freetimes*/
            this.setState({dbInfo: myJson.here}); 
            // Get events of group from database
            //newGroup.events = myJson.events;
            
            var currGroups = this.state.groups;
        
            //console.log("Prior to adding new group", this.state.groups);

            var events = (groupName === "Yerr") ? ([
              {
                start: new Date('2018-12-08T02:00:00-05:00'),
                end: new Date('2018-12-08T03:00:00-05:00'),
                title: "Some title" 
              },
      
              {
              start: new Date(2019, 0, 1, 12, 30),
              end: new Date(2019, 0, 1, 17, 15),
              title: "Trial#2"
              }
            ]) : ([{
              start: new Date('2019-02-08T02:00:00-05:00'),
              end: new Date('2019-02-08T03:00:00-05:00'),
              title: "Some title" 
            }]);

            var newGroup = {
              name: groupName, 
              emails: groupEmails, 
              ID: groupID,
              events: events
            };
            
            currGroups[groupID] = newGroup;
            // console.log("New group events: " + newGroup.events);
            // console.log("New group: ", currGroups[groupID].events);
            this.setState({groups: currGroups});

            console.log("Added this group: " + groupID, this.state.groups);
        }.bind(this)
    );
  }


  deleteGroup = (groupID) => {
    var filteredGroups = this.state.groups;
    delete filteredGroups[groupID];
    
    this.setState({groups: filteredGroups});
    //console.log(this.state.groups);
    //console.log("djsandkajsndkas", groupID)

    /**********/
        // send data to database
        const myHeaders = new Headers();

        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', this.state.token);
        myHeaders.append('groupid', groupID)
        
          fetch('http://localhost:4000/profile/deletegroup', {
                method: 'GET',
                headers: myHeaders,
            })
            .then(function(response) {  
                return response.json();
            })
            .then(function(myJson) {
                console.log(JSON.stringify(myJson));
                this.setState({dbInfo: myJson.here}); 
            }.bind(this)
        );
    /*************/



  }


  // newMembers and oldMembers are list
  updateGroup = (groupID, newMembers, oldMembers) => {

    var updatedGroups = this.state.groups;
    //console.log(updatedGroups[groupID] == true);
    if (updatedGroups[groupID])
    {
      //console.log("Yup");
      for (var member of newMembers)
        updatedGroups[groupID].emails.add(member);
      for (var member of oldMembers)
        updatedGroups[groupID].emails.delete(member);
    }
    // send data to database
    const myHeaders = new Headers();

    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', this.state.token);
    myHeaders.append('groupid', groupID)
    myHeaders.append('oldgroupmembers', oldMembers)
    myHeaders.append('newgroupmembers', newMembers)

      fetch('http://localhost:4000/profile/updategroup', {
            method: 'GET',
            headers: myHeaders,
        })
        .then(function(response) {  
            return response.json();
        })
        .then(function(myJson) {
            console.log(JSON.stringify(myJson));
            this.setState({dbInfo: myJson.here}); 
            console.log("Current state info: " + this.state.dbInfo);
        }.bind(this)
    );
  }


    



  // here is our UI
  // it is easy to understand their functions when you 
  // see them render into our screen
  render() {

    return (
        <div>
        <div>
           <Header />
        </div>
        
        
          <div className="row">
            <div className="column menu">
              <MenuContainer 
                createGroup={this.createGroup}
                deleteGroup={this.deleteGroup}
                updateGroup={this.updateGroup}
                onSubmit={this.onGroupFormSubmit}
                viewAllGroups={this.viewAllGroups}
                viewSingleGroup={this.viewSingleGroup}
                groups={this.state.groups}
              />
            </div>

            <div className="column calendar">
              <Calendar
                localizer={localizer}
                defaultDate={new Date()}
                defaultView="month"
                //events = {[]}
                events={this.state.isSingleGroup ? this.state.stateCalSingleGroup : this.state.stateCalAllGroups}
                style={{ height: "80vh" }}
              />
            </div>
          
          </div>

          <div style={{ padding: "10px" }}>
            
           
            <button onClick={() => this.getmyFreeTime()}>
              GET MY FREE TIME
            </button>

          </div>

        
  
        </div>
      );
    }
  }
  
  export default App;
    
    