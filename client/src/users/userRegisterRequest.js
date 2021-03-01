const request = require('request');

export default function createUserAccount(username, email, password, teacher, callback) {
    request.post({
        url: '/api/users/register',
        body: {
            username: username,
            email: email,
            password: password,
            teacher: teacher
        },
        mode: 'no-cors',
        json: true,
        withCredentials: true
    }, (err, res, body) => {
        return callback(res);
    });
    return;
}