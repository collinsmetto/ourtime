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
          groups: {}
          };
        
        // this.stateCal = {
     
        //     events: [
        //       // {
        //       //   start: new Date(2019, 0, 9, 12, 30),
        //       //   end: new Date(2019, 0, 9, 2, 15),
        //       //   title: "A Suggested meeting time for Group OurTime" 
        //       // },
      
        //       // {
        //       //   start: new Date(2019, 0, 11, 10, 30),
        //       //   end: new Date(2019, 0, 11, 13, 15),
        //       //   title: "A Suggested meeting time for Group OurTime" 
        //       // },

        //       // {
        //       //   start: new Date(2019, 0, 9, 1, 30),
        //       //   end: new Date(2019, 0, 9, 3, 15),
        //       //   title: "A Suggested meeting time for Group OurTime" 
        //       // },    
        //   ]
           
        //   };
        this.createGroup = this.createGroup.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);
        this.updateGroup = this.updateGroup.bind(this);
    }
  //   myCallback = (dataFromChild) => {
  //     //[...we will use the dataFromChild here...]
  //     //this.setState({stateCal:dataFromChild});
  //     //console.log(this.state.stateCal);
  //     console.log("!!!!!!!!!!!!!!!!!!!!!!!!!")
  // }
 
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
              
            console.log(JSON.stringify(myJson.here));
          //  this.stateCal.events = myJson.events;
          }
          );
    }

  
  
/*
    googleResponse = (response) => {
        const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
        const options = {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors',
            cache: 'default'
        };
        fetch('http://localhost:4000/api/v1/auth/google', options)
 
        .then(r => {
            const token = r.headers.get('x-auth-token');
            console.log(r);
            console.log(token)
            r.json().then(user => {
                if (token) {
                    this.setState({isAuthenticated: true, user, token})
                }
            });
        }) 
    };
*/
  

  // just a note, here, in the front end, we use the id key of our data object 
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify 
  // data base entries

  // our first get method that uses our backend api to 
  // fetch data from our data base
  /*
  getDataFromDb = () => {
    fetch("/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };
  
  */

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


  // here is our UI
  // it is easy to understand their functions when you 
  // see them render into our screen
  render() {
    const { data } = this.state;


    // our put method that uses our backend api
    // to create new query into our data base
    let putDataToDB = message => {
      let currentIds = this.state.data.map(data => data.id);
      let idToBeAdded = 0;
      while (currentIds.includes(idToBeAdded)) {
        ++idToBeAdded;
      }

      axios.post("/api/putData", {
        id: idToBeAdded,
        message: message
      });
    };


    // our delete method that uses our backend api 
    // to remove existing database information
    let deleteFromDB = idTodelete => {
      let objIdToDelete = null;
      this.state.data.forEach(dat => {
        if (dat.id === idTodelete) {
          objIdToDelete = dat._id;
        }
      });

      axios.delete("/api/deleteData", {
        data: {
          id: objIdToDelete
        }
      });
    };


    // our update method that uses our backend api
    // to overwrite existing data base information
    let updateDB = (idToUpdate, updateToApply) => {
      let objIdToUpdate = null;
      this.state.data.forEach(dat => {
        if (dat.id === idToUpdate) {
          objIdToUpdate = dat._id;
        }
      });

      axios.post("/api/updateData", {
        id: objIdToUpdate,
        update: { message: updateToApply }
      });
    };

    
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
                events = {[]}
                //events={this.state.stateCal.events}
                style={{ height: "80vh" }}
              />
            </div>
          
          </div>
        
  
          
  
          <div style={{ padding: "10px" }}>
            <Input
              type="text"
              onChange={e => this.setState({ message: e.target.value })}
              placeholder="add something in the database"
              style={{ width: "200px" }}
            />
            <button onClick={() => console.log(this.state.token)}>
              LOG TO CONSOLE
            </button>
            <button onClick={() => this.getmyFreeTime()}>
              GET MY FREE TIME
            </button>

          </div>
  
          <div style={{ padding: "10px" }}>
            <Input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ idToDelete: e.target.value })}
              placeholder="put id of item to delete here"
            />
            {/* <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
              DELETE
            </button> */}
          </div>
  
          <div style={{ padding: "10px" }}>
            <Input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ idToUpdate: e.target.value })}
              placeholder="id of item to update here"
            />
            <Input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ updateToApply: e.target.value })}
              placeholder="put new value of the item here"
            />
            <button
              onClick={() =>
                this.updateDB(this.state.idToUpdate, this.state.updateToApply)
              }
            >
            </button>
          </div>
        {/* <div>
        <MenuContainer stateCal={this.state.stateCal} someFn={(stateCal) => this.setState({stateCal})}/>
      </div> */}
          <div>
          <Event_Comp stateCal={this.state.stateCal}  getEvents={(stateCal) => this.setState({stateCal})}/>
          </div>
          <button onClick={() => console.log(this.state.stateCal)}>Checker of state</button>




        
          {/* <div>
            <MenuContainer callbackFromParent={this.myCallback}/>
          </div>
          <button
              callbackFromParent={this.myCallback}
              onClick={() =>
                console.log(this.state.stateCal)
              }
            > testing child to parent</button> */}



  
        </body>
  
        </div>
      );
    }
  }
  
  export default App;
    
    //render() {
    /*
    let content = !!this.state.isAuthenticated ?
            (
                <div>
                   <Header/>
                    <GroupList/>

                    <p>Authenticated</p>
                    <div>
                        {this.state.user.email}
                    </div>
                    <div>
                        <button onClick={this.logout} className="button">
                            Log out
                        </button>
                    </div>
                </div>
            ) :
            
            
            (
                <div>        
                    <GoogleLogin
                        clientId={config.GOOGLE_CLIENT_ID}
                        buttonText="Login"
                        onSuccess={this.googleResponse}
                        onFailure={this.onFailure}
                    />




                </div>
            );

        return (
            <div className="App">
                {content}
            </div>
        );
    }
}

export default App;
*/