import React from 'react';
import './UsersRegister.css';
import createUserAccount from './userRegisterRequest';
const validator = require('validator');

// Forbidden characters array to be used later.
let forbiddenCharacters = ['<', '>', '{', '}', ' ', '=', ',', ':'];

export default function UsersRegister() {

    function executeAccountCreation() {
        // We are hiding the submit button to avoid spamming.
        document.getElementById('submit-button').style.display = 'none';
        // We are resetting the error message at each function call.
        document.getElementById('yourlendar-register-message').innerHTML = '';

        // If the validate password field is not exactly the same as the password field, we are returning an error.
        if(!(document.getElementById('yourlendar-password-register').value === document.getElementById('yourlendar-confirm-password-register').value)) {
            document.getElementById('submit-button').style.display = 'inline';
            return document.getElementById('yourlendar-register-message').innerHTML = 'Veuillez vérifier la concordance entre les deux mots de passe entrés.';
        
        // If the password is less than 8 characters, we are returning an error.
        } else if(document.getElementById('yourlendar-password-register').value.length < 8) {
            document.getElementById('submit-button').style.display = 'inline';
            return document.getElementById('yourlendar-register-message').innerHTML = 'Votre mot de passe doit faire au moins 8 caractères.';

        // If the email is incorrect, we are returning an error.
       /* } else if(!validator.isEmail(document.getElementById('yourlendar-email-register').value)) {
            document.getElementById('submit-button').style.display = 'inline';
            return document.getElementById('yourlendar-register-message').innerHTML = 'Veuillez entrer un email correct.';  
        */

        // Checking if the name and the surname are correct.
        } else if(document.getElementById('yourlendar-surname-register').value.length < 2 || document.getElementById('yourlendar-name-register').value.length < 2) {
            document.getElementById('submit-button').style.display = 'inline';
            return document.getElementById('yourlendar-register-message').innerHTML = 'Veuillez entrer un nom et un prénom correct.';  
        }

        // Checking for inappropriate characters in the username. (So that users can't manipulate the source code with the inputs.)
        for(let i = 0; i < forbiddenCharacters.length; i++) {
            if(document.getElementById('yourlendar-username-register').value.includes(forbiddenCharacters[i])) {
                document.getElementById('submit-button').style.display = 'inline';
                return document.getElementById('yourlendar-register-message').innerHTML = 'Veuillez entrer un nom d\'utilisateur correct.';
            }
        }

        createUserAccount(document.getElementById('yourlendar-surname-register').value, document.getElementById('yourlendar-name-register').value, document.getElementById('yourlendar-username-register').value, document.getElementById('yourlendar-password-register').value, document.getElementById('yourlendar-isTeacher').checked, (statusCode) => {
            if (statusCode === 201) {
                document.getElementById('yourlendar-register-message').style.color = 'green';
                document.getElementById('yourlendar-register-message').innerHTML = 'Votre compte a bien été crée. Vous allez être redirigé..'
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else if(statusCode === 400) {
                document.getElementById('submit-button').style.display = 'inline';
                return document.getElementById('yourlendar-register-message').innerHTML = "Une erreur s'est produite..";
            }
        });

        return;
    };

    function handleKeyPress(e) {
        if(e.keyCode === 13 || e.charCode === 13){
            document.getElementById('submit-button').click();
        }
    }

    return (
        <div className='register-container'>
            <div className='register-form'>
                <h1>Yourlendar</h1>
                <h3>Enregistrement</h3>

                <div className='register-form-content'>
                    <input className='register-form-input' onKeyPress={(e) => handleKeyPress(e)} id='yourlendar-surname-register' spellCheck='false' type='text' placeholder="Nom"></input>
                </div>

                <div className='register-form-content'>
                    <input className='register-form-input' onKeyPress={(e) => handleKeyPress(e)} id='yourlendar-name-register' spellCheck='false' type='text' placeholder="Prénom"></input>
                </div>

                <div className='register-form-content'>
                    <input className='register-form-input' onKeyPress={(e) => handleKeyPress(e)} id='yourlendar-username-register' spellCheck='false' type='text' placeholder="Nom d'utilisateur"></input>
                </div>

                <div className='register-form-content'>
                    <input className='register-form-input' onKeyPress={(e) => handleKeyPress(e)} id='yourlendar-password-register' spellCheck='false' type='password' placeholder='Mot de passe'></input>
                </div>

                <div className='register-form-content'>
                    <input className='register-form-input' onKeyPress={(e) => handleKeyPress(e)} id='yourlendar-confirm-password-register' spellCheck='false' type='password' placeholder='Confirmer mot de passe'></input>
                </div>

                <div className='register-form-content'>
                    <label className="inline-flex items-center">
                        <input id='yourlendar-isTeacher' type="checkbox" class="form-checkbox"  />
                        <span className="ml-2 text-white">Compte professeur</span>
                    </label>
                </div>
                
                <div className='register-form-content'>
                    <button id='submit-button' onClick={() => executeAccountCreation()}>S'enregistrer</button>
                </div>

                <p style={{'color': 'white', 'marginBottom': '25px'}}>Vous avez déjà un compte ? <a style={{'color': 'green', 'textDecorationLine': 'underline'}} href='/users/auth'>Se connecter</a></p>
                <p style={{'color': 'red', 'display': 'inline', 'marginTop': '25px'}} id='yourlendar-register-message'></p>
            </div>
        </div>
    );
};