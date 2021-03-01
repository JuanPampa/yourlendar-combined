import React from 'react';
import './Users.css';
export default class Users extends React.Component {
    render() {
        return (
            <div className='users-container'>
                <div className='users'>
                    <h1>Yourlendar</h1>
                    <h4>Bonjour ! Dites-moi qui vous êtes.</h4>
                    <a className='users-a' href='/users/auth'>
                        <button className='users-button' id='yourlendar-users-connect' style={{'backgroundColor': '#16A085'}}>Se connecter</button>
                    </a>
                    <a className='users-a' href='/users/register'>
                        <button className='users-button' id='yourlendar-users-register' style={{'backgroundColor': '#EA4C88'}}>S'enregistrer</button>
                    </a>
                </div>
            </div>
        )
    }
};