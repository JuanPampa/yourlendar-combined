const request = require('request');

export default function userAuthentication(username, password, callback) {
    request.post({
        url: '/api/users/auth',
        body: {
            username: username,
            password: password
        },
        json: true,
        withCredentials: true
    }, (err, res, body) => {
        return callback(res);
    });
    return;
}

