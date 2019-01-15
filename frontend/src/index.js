import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
//import { BrowserRouter } from 'react-router-dom';
//import registerServiceWorker from './registerServiceWorker';
import LoginPage from './LoginPage';
var destination = document.querySelector("#root");


/*<BrowserRouter>
    <App />
</BrowserRouter>, document.getElementById('root'));
registerServiceWorker();*/
ReactDOM.render(
    //<App />,
    <LoginPage />, 
    destination );
