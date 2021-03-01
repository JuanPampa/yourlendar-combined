export default function userAuthentication(username, password, callback) {

    fetch("/api/users/auth", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    }).then().then(data => {
        return callback(data.status);
    });
    
    return;
}

