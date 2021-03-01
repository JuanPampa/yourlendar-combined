const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../schemas/UserSchema');
const userAuth = require('../middleware/userauth');

const router = new express.Router(); // Creating a new express router to handle the different routes.

router.get('/api//users', userAuth, async (req, res) => {
    // If there is a token, we let the access to the user. (status 200)
    if(req.token) {
        let userObject = {
            username: req.user.username,
            email: req.user.email,
            teacher: req.user.teacher
        }
        return res.status(200).json(userObject);
    }
    else return res.status(400).send('Vous n\'êtes pas authentifié.');
});

router.post('/api//users/register', async (req, res) => {
    // Checking if the request body is correct so that we can proceed with the account creation.
    if(!req.body.username || !req.body.email || !req.body.password) return res.status(400).send('Veuillez vérifier votre requête.');
    if(!req.body.teacher) req.body.teacher = false;
    // Hashing the password so that it can be stored safely in the database.
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    // Creating a new User object using the body of the request.
    const createdUser = new User(req.body);

    // Checking for username or email in database to avoid creating two user accounts with the same username/email.
    const checkForUserExistence = await User.findOne({$or:[{username: createdUser.username}, {email: createdUser.email}]});
    if(checkForUserExistence) return res.status(400).send('L\'utilisateur est déjà enregistré.');

    // Generating a new user token with the generateUserToken static.
    const yourlendarToken = await User.generateUserToken(createdUser.username);

    // Putting in the tokens array the new token that we generated in an object.
    createdUser.tokens = createdUser.tokens.concat({'yourlendartoken': yourlendarToken});

    // Saving the User object in the MongoDB database.
    await createdUser.save();

    // Returning a 200 status to the user aswell as the cookie.
    return res.status(201).cookie('access_token_yourlendar', 'Bearer ' + yourlendarToken, {maxAge: 610000000}).send('Votre compte à été crée.');
});

router.post('/api//users/auth', userAuth, async (req, res) => {
    if(req.token) return res.status(200).send('Vous êtes déjà connecté, vous allez être redirigé..')

    // Checking if the request body is correct so that we can proceed with the request handling.
    if(!req.body.username || !req.body.password) return res.status(400).send('Mauvaise requête.');

    // Checking the user existence.
    const checkForUser = await User.findOne({username: req.body.username});
    if(!checkForUser) return res.status(400).send('Vos identifiants sont incorrects.');

    // Checking if the request password matches the hashed password in the database.
    const checkForPasswordConcordance = await bcrypt.compare(req.body.password, checkForUser.password, async (err, result) => {
        if(!result) return res.status(400).send('Vos identifiants sont incorrects.');
        else {
            // Generating a new user token for this user and saving it in the tokens array in the user document stored in the database.
            const newYourlendarToken = await User.generateUserToken(req.body.username);
            checkForUser.tokens = checkForUser.tokens.concat({'yourlendartoken': newYourlendarToken});
            // Saving the modified User object in the mongoDB database.
            await checkForUser.save();

            // Returning a 200 status to the user aswell as the cookie.
            return res.status(200).cookie('access_token_yourlendar', 'Bearer ' + newYourlendarToken, {maxAge: 610000000}).send('Vous êtes bien connecté, vous allez être redirigé..');
        }
    });
    return;
});

router.post('/api//users/logout', userAuth, async(req, res) => {
    if(req.token) {
        /*
            I'm here using the filter function that will return only elements without the user token so that 
            I can store back the user object in the database without the logged out user token.
        */
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.yourlendartoken !== req.token;
        });

        // Saving the user object back to the database.
        await req.user.save();
        
        // We are here kind of deleting the cookie by setting the expiration to now and it's content to anything.
        return res.status(200).cookie('access_token_yourlendar', '', {expiresIn: Date.now()}).send('Vous vous êtes bien deconnecté.');
    } 
    else res.status(400).send('Vous devez d\'abord vous connecter, pour vous déconnecter..');
});

router.get('/api//users/all', userAuth, async (req, res) => {
    User.find({}, (request, users) => {
        let userList = []

        users.forEach((user) => {
            let username = user.username;
            let id = user._id;
            let userObject = {
                username: username,
                id: id
            };
            userList.push(userObject);
        })

        res.send(userList);
    })
});

router.get('/api//users/students', userAuth, async (req, res) => {
    User.find({}, (request, users) => {
        let userList = []

        users.forEach((user) => {
            if(!user.teacher) {
                let username = user.username;
                let id = user._id;
                let userObject = {
                    username: username,
                    id: id
                };
                userList.push(userObject);
            }
        })


        res.send(userList);
    })
});

router.get('/api//users/teachers', userAuth, async (req, res) => {
    User.find({}, (request, users) => {
        let userList = []

        users.forEach((user) => {
            if(user.teacher) {
                let username = user.username;
                let id = user._id;
                let userObject = {
                    username: username,
                    id: id
                };
                userList.push(userObject);
            }
        })

        res.send(userList);
    })
});

module.exports = router;