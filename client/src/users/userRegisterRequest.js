export default function createUserAccount(surname, name, username, password, teacher, callback) {

    fetch("/api/users/register", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            surname: surname,
            name: name,
            username: username,
            password: password,
            teacher: teacher
        })
    }).then().then(data => {
        return callback(data.status);
    });


    /*request.post({
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
    });*/
    return;
}