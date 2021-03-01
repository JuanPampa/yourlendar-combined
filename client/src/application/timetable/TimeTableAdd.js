import React from 'react';
import SearchBox from './SearchBox';

export default class TimeTableAdd extends React.Component {
    constructor(props) {
        super(props);
        this.username = this.props.username;
        this.state = {
            isLoaded: false,
            searchBar: "",
            users: [],
            usersChosen: []
        }
    }

    getAllUsers() {

        fetch("/api/users/students", {
            method: "GET",
            mode: "cors",
            credentials: "include"
        }).then(res => {return res.text()}).then((data) => {

            JSON.parse(data).forEach((user) => {
                this.setState({users: this.state.users.concat([user.username])})
            })
            
            return this.setState({isLoaded: true})
        })

        /*request.get({
            url: '/api/users/students',
            withCredentials: true
        }, (err, res, body) => {

            JSON.parse(body).forEach((user) => {
                this.setState({users: this.state.users.concat([user.username])});
            })

            return this.setState({isLoaded: true});
        })*/
    }
    
    addUser(username) {
        this.setState({users: this.state.users.filter(user => !(user === username))});
        this.setState({usersChosen: this.state.usersChosen.concat([username])});
    }

    removeUser(username) {
        this.setState({usersChosen: this.state.usersChosen.filter(user => !(user === username))});
        this.setState({users: this.state.users.concat([username])});
    }

    addTimeTableItem(keyword, description, date) {

        fetch("/api/timetable", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                keyword: keyword,
                description: description,
                date: date,
                teacher: this.username,
                users: this.state.usersChosen
            })
        }).then().then(() => this.setState({isLoaded: false}));

        /*request.post({
            url: "http://localhost:8000/timetable",
            json: true,
            body: {
                keyword: keyword,
                description: description,
                date: date,
                teacher: this.username,
                users: this.state.usersChosen
            },
        })
        
        this.setState({isLoaded: false});*/
    }

    componentDidMount() {
        this.getAllUsers();
    }

    render() {
        const {users, searchBar} = this.state;
        const filteredUsers = users.filter(user => user.toLowerCase().includes(searchBar.toLowerCase()))

        if(this.state.isLoaded) {
            return (
                <div className='m-auto ml-5 mr-5'>
                    <h1> Ajouter un devoir </h1>
                    <div className='m-10'>
                        {/* <h2>Pseudonyme ENT:</h2> */}
                        <input className='login-form-input' id='timetable-keyword' spellCheck='false'type='text' placeholder="Nom du devoir"></input>
                    </div>
                    <div className='m-10'>
                        {/* <h2>Mot de passe ENT:</h2> */}
                        <input className='login-form-input' id='timetable-description' spellCheck='false' type='text' placeholder='Description (optionnelle)'></input>
                    </div>
                    <div className='m-10'>
                        <h2>Date limite:</h2>
                        <input className='login-form-input' id='timetable-date' spellCheck='false' type='date'></input>
                    </div>
                    <div className='m-10'>
                        {this.state.usersChosen.length > 0 && <UsersChosen users={this.state.usersChosen} removeUser={(username) => this.removeUser(username)}/>}
                        <div className='mb-3'>
                            <SearchBox placeholder='Recherchez un élève' handleChange={(e) => this.setState({searchBar: e.target.value})}/>
                        </div>
                        {this.state.searchBar.length > 0 && <UsersList users={filteredUsers} addUser={(username) => this.addUser(username)}/>}
                    </div>
                    
                    <div className='m-10'>
                        <button id='submit-button' onClick={() => this.addTimeTableItem(document.getElementById("timetable-keyword").value, document.getElementById("timetable-description").value, document.getElementById("timetable-date").value)}>Créer le devoir</button>
                    </div>
                </div>
            )
        }
        else return <div></div>
    }
}

function UsersList(props) {
    let renderedArray = []
    props.users.forEach(user => {
        renderedArray.push(<button key={user} className='button bg-green-500 block' onClick={() => props.addUser(user)}>{user}</button>)
    })
    return (
        <div className='block space-y-4'>
            {renderedArray}
        </div>
    )
}

function UsersChosen(props) {
    let renderedArray = []
    props.users.forEach(user => {
        renderedArray.push(<button key={user} className='button bg-red-500 block mb-2' onClick={() => props.removeUser(user)}>{user}</button>)
    })
    return (
        <div className='block space-y-4'>
            {renderedArray}
        </div>
    )
}