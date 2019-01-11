import React, { Component } from "react";

import {GoogleLogin} from 'react-google-login';
import "./LoginPage.css";
import "./ContactForm";
import axios from "axios";
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
      
    
    //   getDataFromDb = () => {
    //     const options = {
    //         method: "GET",
    //         body: this.state.token,
    //         mode: "cors",
    //         cache: "default",
    //         headers:{'Authorization': 'Bearer ${this.state.token}', 'Accept': 'application/json',
    //         'Content-Type': 'application/json'}
    //     };
    //     console.log(options.headers)
        
    //         /****/
    //     //fetch('http://localhost:4000/api/v1/auth/response', options).then(r => { });
         
    //     axios.get("http://localhost:4000/api/v1/auth/response", {params: {resp: this.state.token}}, {header: options});
    // }
    getDataFromDb = () => {
        const options = {
            method: "POST",
            body: this.state.token,
            mode: "cors",
            cache: "default",
            params: {resp: this.state.token},
            // headers:{'Authorization': 'Bearer ${this.state.token}', 'Accept': 'application/json',
            // 'Content-Type': 'application/json'}
        };
        //console.log(options.headers)
        console.log(this.state.token)
            /****/
        
       // axios.get("http://localhost:4000/api/v1/auth/response", {params: {resp: this.state.token}}, {header: options});
    fetch('http://localhost:4000/api/v1/auth/response', 
    {
        method: "POST",
        body: this.state.token,
        mode: "cors",
        cache: "default",
        params: {resp: this.state.token},
         headers:{'Accept': 'application/json',
         'Content-Type': 'application/json'}
    })
        .then(function(response) { 


           //return response.json();
        })
        .then(function(myJson) {
            //console.log(JSON.stringify(myJson));
        });
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
                r.json().then(user => {
                    if (token) {
                        this.setState({isAuthenticated: true, user, token})
                    }
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
                <App />
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
                    clientId="970607326037-b35kqjosvjh86iqhrkpogg49v7d9ld1p.apps.googleusercontent.com"
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