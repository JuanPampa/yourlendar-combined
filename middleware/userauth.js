const User = require('../schemas/UserSchema');

/* 
Express middlewares are taking three parameters, req, which is the request sent by the user, 
res, which can be manipulated to send responses to the user and a next callback function to continue 
the route. Because of course it's a MIDDLEware function, that is going to be executed in the middle. 
*/

async function userCheckForAuth(req, res, next) {
    // If there is no cookie, or no cookie that includes "access_token", we are sending a 400 status.
    if(!req.headers.cookie || !req.headers.cookie.includes('access_token_yourlendar')) return next();
    
    /*
        We are splitting the token that looks something like this:
        access_token_yourlendartokeneyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoibW1rZ29mcHNna2ZzIiwiaWF0IjoxNjAzNjMzNzg4LCJleHAiOjE2MDQyMzg1ODh9.tD31MrlTRysrtQy-e51GjCX0OTlGVyMhjzxMZ1akeWY

        We are using the '%20' to get the user token.
    */
    const userToken = req.headers.cookie.split("token")[2].split(";")[0];
    return res.status(200).send(userToken)

    // We are checking if, in the database, we have got this token.
    const checkForUserToken = await User.findOne({"tokens.yourlendartoken": userToken});
    if(!checkForUserToken) return next();
    /*
        We are putting two addtional informations in the request which are:
            - the user token,
            - the user object
    */
    req.token = userToken;
    req.user = checkForUserToken;

    // next() function is to proceed with the router handle, it's a middleware function.
    return next();
};

module.exports = userCheckForAuth;