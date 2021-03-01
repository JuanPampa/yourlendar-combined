import React from 'react';
import './UsersAuth.css';

import userAuthentication from './userAuthentication';

export default function UsersAuth() {

    function hideConnectButton() {
        document.getElementById('submit-button').style.display = 'none';
        return;
    }

    function errorHandle(err) {
        document.getElementById('yourlendar-login-message').style.color = 'red';
        document.getElementById('yourlendar-login-message').innerHTML = err;

        showConnectButton();
        return;
    }

    function showConnectButton() {
        document.getElementById('submit-button').style.display = 'inline';
        return;
    }

    function sendToUserAuth(username, password) {
        // On enlève le message d'erreur à chaque appel de cette fonction
        hideConnectButton();
        document.getElementById('yourlendar-login-message').innerHTML = '';

        // We are calling the created function to make a POST call to the api.
        userAuthentication(username, password, (statusCode) => {
            // If the status code is 200 (success).
            if(statusCode === 200) {
                document.getElementById('yourlendar-login-message').style.color = 'green';
                document.getElementById('yourlendar-login-message').innerHTML = "Vous êtes désormais connecté, vous allez être redirigé..";
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000)
            // If the status code is 400 (fail), we are calling the errorHandle function.
            } else if(statusCode === 400) {
                errorHandle("Une erreur s'est produite..");
            }
        });
        return;
    }

    function handleKeyPress(e) {
        if(e.keyCode === 13 || e.charCode === 13){
            document.getElementById('submit-button').click();
        }
    }

    return (
        <div className='login-container'>
            <div className='login-form'>
                <h1>Yourlendar</h1>
                <h3>Authentification</h3>

                <div className='login-form-content'>
                    {/* <h2>Pseudonyme ENT:</h2> */}
                    <input className='login-form-input' onKeyPress={(e) => handleKeyPress(e)} id='yourlendar-username-login' spellCheck='false'type='text' placeholder="Nom d'utilisateur"></input>
                </div>
                <div className='login-form-content'>
                    {/* <h2>Mot de passe ENT:</h2> */}
                    <input className='login-form-input' onKeyPress={(e) => handleKeyPress(e)} id='yourlendar-password-login' spellCheck='false' type='password' placeholder='Mot de passe'></input>
                </div>
                <div className='login-form-content'>
                    <button id='submit-button' onClick={() => sendToUserAuth(document.getElementById('yourlendar-username-login').value, document.getElementById('yourlendar-password-login').value)}>Se connecter</button>
                </div>

                <p style={{'color': 'white'}}>Vous n'avez pas de compte ? <a style={{'color': 'green', 'textDecorationLine': 'underline'}} href='/users/register'>S'enregistrer</a></p>
                <p id='yourlendar-login-message'></p>
            </div>
        </div>
    );
};