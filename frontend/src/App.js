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
          isAuthenticated: false,  //TO BE PLACED IN LOGINPAGE.JS
          user: null, // TO BE DEFINED IN LOGINPAGE.JS
          token: this.props.tokenFromLogIn,
          stateCal: [], 
          count: 0,
          groups: {},
          dbInfo: ''
          };
        
        this.createGroup = this.createGroup.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);
        this.updateGroup = this.updateGroup.bind(this);
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
              console.log("in getmyFreeTime")
            console.log(JSON.stringify(myJson.events));
            this.setState({stateCal: myJson.events})
          }.bind(this)
          );
    }

    g

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
      
      var currGroups = this.state.groups;
      currGroups[groupID] = newGroup;
      this.setState({groups: currGroups});

      console.log(this.state.groups);

            // send data to database
            const myHeaders = new Headers();

            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', this.state.token);
            myHeaders.append('group', newGroup.name)
            
              fetch('http://localhost:4000/profile/creategroup', {
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

    deleteGroup = (groupID) => {
      var filteredGroups = this.state.groups;
      delete filteredGroups[groupID];
      
      this.setState({groups: filteredGroups});
      console.log(this.state.groups);


    }

    // newMembers and oldMembers are list
    updateGroup = (groupID, newMembers, oldMembers) => {

      var updatedGroups = this.state.groups;
      console.log(updatedGroups[groupID] == true);
      if (updatedGroups[groupID])
      {
        console.log("Yup");
        for (var member of newMembers)
          updatedGroups[groupID].emails.add(member);
        for (var member of oldMembers)
          updatedGroups[groupID].emails.delete(member);
      }
      console.log(this.state.groups);
          



    }

    // List of additional 
    // updateDB(info, ) {
    //   this.state.stateCal = this.props.getDataFromDb
    //   // send data to database
    //   const myHeaders = new Headers();

    //   myHeaders.append('Content-Type', 'application/json');
    //   myHeaders.append('Authorization', this.state.token);
    //   myHeaders.append('group', newGroup.name)
      
    //     fetch('http://localhost:4000/profile/creategroup', {
    //           method: 'GET',
    //           headers: myHeaders,
    //       })
    //       .then(function(response) {  
    //           return response.json();
    //       })
    //       .then(function(myJson) {
    //           console.log(JSON.stringify(myJson));
              
    //       }
    //   );

    // }




  // here is our UI
  // it is easy to understand their functions when you 
  // see them render into our screen
  render() {
    const { data } = this.state;


    



    
    return (
        <div>
        <div>
           <Header />
        </div>
        
        <body>
          <div className="row">
            <div className="column menu">
              <MenuContainer 
                createGroup={this.createGroup}
                deleteGroup={this.deleteGroup}
                updateGroup={this.updateGroup}
                onSubmit={this.onGroupFormSubmit}
              />
            </div>

            <div className="column calendar">
              <Calendar
                localizer={localizer}
                defaultDate={new Date()}
                defaultView="month"
                //events = {[]}
               events={this.state.stateCal}
                style={{ height: "80vh" }}
              />
            </div>
          
          </div>

          <div style={{ padding: "10px" }}>
            
           
            <button onClick={() => this.getmyFreeTime()}>
              GET MY FREE TIME
            </button>

          </div>

        </body>
  
        </div>
      );
    }
  }
  
  export default App;
    
    