import React from 'react';
import Users from '../users/Users';
import ApplicationInterface from './ApplicationInterface';

// Creating a class that extends React Component.
export default class Application extends React.Component {
    /*
        We are initializing this class with the constructor
        which takes props (which is the content passed into the
        class when called) as a parameter.

        We are creating a well-known in react object, which is
        the 'this.state' object with two booleans: 
            - 'isConnected' which will check if the user is connected or not,
            - 'isLoaded' which will check if the page has finished loading.
    */
    constructor(props) {
        super(props);
        
        /*
            Using state react hook to handle those boolean change.
        */
        this.state = {
            isConnected: false,
            isLoaded: false
        };
        this.userObject = {};
      };
    
      componentDidMount() {
        /*
            We are making a GET request to the api with the 'withCredentials' condition 
            to true so that the api can check if the user has a got a user cookie stored.
        
        request.get({
            url: '/api/users',
            withCredentials: true
        // On the response of the api, the callback function is executed.
        }, (err, res, body) => {
            /* 
                If the html status given back by the api is 200, we are setting those
                two booleans to true.
            
           console.log(err)
            if(res.statusCode === 200) {
                this.userObject = JSON.parse(body); 
                return this.setState({
                    isConnected: true,
                    isLoaded: true
                });
            };
            /* 
                We are, here, setting the isConnected boolean to false and the
                isLoaded boolean to true in the 'this.state' object.
            
            return this.setState({
                isConnected: false,
                isLoaded: true
            });
        });
        */

        fetch("/api/users", {
            method: "GET",
            mode: "cors",
            credentials: "include"
        }).then(res => {return res.text()}).then((data) => {
            if(data != "Vous n'êtes pas authentifié.") {
                this.userObject = JSON.parse(data);
                return this.setState({
                    isConnected: true,
                    isLoaded: true
                });
                
            };

            return this.setState({
                isConnected: false,
                isLoaded: true
            });
        })
      };
    
    render() {
        // We are separating the two properties inside the 'this.state' object.
        const {isConnected, isLoaded} = this.state;
        // If the page is not loaded, we are sending a waiting screen to the user.
        if(!isLoaded) {
            return (
                <div className='yourlendar-container'>
                    <div id='yourlendar-loading-container'>
                        <h1>Yourlendar</h1>
                        <p id='yourlendar-loading-text'>Chargement...</p>
                    </div>
                </div>
            );
        /*
         If the page is loaded but the user is not connected, we are sending him the
         'Users' react component with login and register buttons.
        */
        } else if(isLoaded && !isConnected) {
            return(<Users />);
        /*
         If the page is loaded and the user is connected, we are sending him the
         'ApplicationInterface' react component so that he can access the application.
        */
        } else if(isLoaded && isConnected) {
            return (<ApplicationInterface user={this.userObject} />);
        }
    };
};