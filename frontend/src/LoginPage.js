import React, { Component } from "react";

import {GoogleLogin} from 'react-google-login';
import "./LoginPage.css";
import "./ContactForm";
//import axios from "axios";
import App from "./App";
import ContactForm from "./ContactForm";

class LoginPage extends Component {
    constructor(props, context) {
        super(props, context);
        
        this.state = { isAuthenticated: false, user: null, token: ''};
    }

    logout = () => {
        this.setState({isAuthenticated: false, user: null, token: ''})
    };

    onFailure = (error) => {
        alert(error);
      }
    getDataFromDb = () => {
            const myHeaders = new Headers();

                    myHeaders.append('Content-Type', 'application/json');
                    myHeaders.append('Authorization', this.state.token); 
                    
                    fetch('http://localhost:4000/profile/response', {
                        method: 'GET',
                        headers: myHeaders,
                    })
                    .then(function(response) {  
                        return response.json();
                    })
                    .then(function(myJson) {
                        console.log(JSON.stringify(myJson));
                    }
                    );
    }
    
    render() {
        let googleResponse = (response) => {
            const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
            const options = {
                method: 'POST',
                body: tokenBlob,
                mode: 'cors',
                cache: 'default'
            };
            fetch('http://localhost:4000/api/v1/auth/google', options).then(r => {
                const token = r.headers.get('x-auth-token');
                console.log(token);
                r.json().then(user => {
                    if (token) {
                        this.setState({isAuthenticated: true, user, token});
                        console.log(this.state.isAuthenticated);
                    }
                    else console.log("Token does not exist?: " + this.state.isAuthenticated);
                });
            })
        };
        
        // console.log("Rendering: Menu");
        let page = !!this.state.isAuthenticated ?
        (
            /* {this.renderRedirect()}
                <button onClick={this.setRedirect}>Redirect</button>*/
            <div>
                {/* <p>Authenticated</p>
                <div>
                    {this.state.user.email}
                </div>
                <div>
                    <button onClick={this.logout} className="button">
                        Log out
                    </button>
                </div> */}
                <App 
                    tokenFromLogIn = {this.state.token}
                    getDataFromDb = {this.getDataFromDb}
                 />
             
                <div>
                    <button onClick={this.getDataFromDb} className="button">
                        GetDatafromDb
                    </button>
                </div>
                <div>
                    <button onClick={this.logout} className="button">
                        Log out
                    </button>
                </div>
                <div><ContactForm/></div>
            </div>
        ) :
        (   <div>

            <div className="welcomeText">
                <h1>Welcome to Our Time</h1>
                <p>Please sign in with your Google Account</p>
                </div>
            <div id="loginButton">
                <GoogleLogin
                    className="loginButton"
                    clientId="638468978131-3h0pn864qjf12p11vjig3lr27qpondnf.apps.googleusercontent.com"
                    scope = "email profile https://www.googleapis.com/auth/calendar"
                    buttonText="Login"
                    onSuccess={googleResponse}
                    onFailure={googleResponse}
                    offline={false}
                    approvalPrompt="force"
                    responseType="id_token"
                    isSignedIn
                    theme="dark"
                />
            </div> 
            </div>
        );

        return (
            <div >
                {page}
            </div>
        );
    }
}

export default LoginPage;




/***** */

 //console.log(options.headers)
        
            /****/
        
       // axios.get("http://localhost:4000/api/v1/auth/response", {params: {resp: this.state.token}}, {header: options});
    // fetch('http://localhost:4000/api/v1/auth/response', 
    // {
    //     method: "POST",
    //     body: this.state.token,
    //     mode: "cors",
    //     cache: "default",
    //     params: {resp: this.state.token},
    //      headers:{'Accept': 'application/json',
    //      'Content-Type': 'application/json'}
    // })