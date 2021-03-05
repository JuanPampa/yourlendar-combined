import React from 'react';

export default class AddElement extends React.Component {
    render() {
        return (
            <div className='md:flex bg-gray-600'>
                <input className='login-form-input' id='yourlendar-username-login' spellCheck='false' type='text' placeholder="Nom de l'évènement"></input>
                <input className='login-form-input' id='yourlendar-username-login' spellCheck='false' type='date' placeholder="Date"></input>
                <input className='login-form-input' id='yourlendar-username-login' spellCheck='false' type='color' placeholder="Couleur"></input>
                <input className='login-form-input' id='yourlendar-username-login' spellCheck='checkbox' type='text' placeholder="Important ?"></input>
                <input className='login-form-input' id='yourlendar-username-login' spellCheck='false' type='text' placeholder="Description"></input>
            </div>
        )
    };
};