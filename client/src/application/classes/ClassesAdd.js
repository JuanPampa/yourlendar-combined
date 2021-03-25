import React from 'react';
import SearchBox from '../SearchBox';

export default class ClassesAdd extends React.Component {
    constructor(props){
        super(props);
        this.teacher = {
            username: this.props.teacher.username,
            name: this.props.teacher.name
        };
        this.state = {
            users: [],
            usersChosen: [],
            searchBar: "",
            isLoaded: false
        };
    }

    getAllUsers() {
        fetch("/api/users/students", {
            method: "GET",
            mode: "cors",
            credentials: "include"
        }).then(res => {return res.text()}).then((data) => {

            JSON.parse(data).forEach((user) => {
                this.setState({users: this.state.users.concat([user])})
            })
            
            return this.setState({isLoaded: true})
        })
    }

    addClassItem(name) {

        this.state.usersChosen.forEach(user => {
            delete user.id; 
        })

        classAdd(name, this.teacher, this.state.usersChosen);
        
        window.location.href = "/classes"

        return this.setState({isLoaded: false})
    }

    addUser(userEntered) {
        this.setState({users: this.state.users.filter(user => !(user.username === userEntered.username))});
        this.setState({usersChosen: this.state.usersChosen.concat([userEntered])});
    }

    removeUser(userEntered) {
        this.setState({usersChosen: this.state.usersChosen.filter(user => !(user.username === userEntered.username))});
        this.setState({users: this.state.users.concat([userEntered])});
    }

    componentDidMount() {
        this.getAllUsers();
    }

    render() {
        const {users, searchBar} = this.state;
        const filteredUsers = users.filter(user => (user.surname.toLowerCase() + ' ' + user.name.toLowerCase()).includes(searchBar.toLowerCase()))

        if(this.state.isLoaded) {
            return (
                <div className='m-auto ml-5 mr-5'>
                    <h1> Ajouter une classe </h1>
                    <div className='m-10'>
                        {/* <h2>Pseudonyme ENT:</h2> */}
                        <input className='login-form-input' id='class-name' spellCheck='false'type='text' placeholder="Nom de la classe"></input>
                    </div>
                    <div className='m-10'>
                        <h3 className="text-red-500">Élèves choisis:</h3>
                        {this.state.usersChosen.length > 0 && <UsersChosen users={this.state.usersChosen} removeUser={(user) => this.removeUser(user)}/>}
                        <div className='mb-3'>
                            <SearchBox placeholder='Recherchez un élève' handleChange={(e) => this.setState({searchBar: e.target.value})}/>
                        </div>
                        <h3 className="text-green-500">Élèves pouvant être choisis:</h3>
                        {this.state.searchBar.length > 0 && <UsersList users={filteredUsers} addUser={(user) => this.addUser(user)}/>}
                    </div>
                    
                    <div className='m-10'>
                        <button id='submit-button' onClick={() => this.addClassItem(document.getElementById("class-name").value)}>Créer la classe</button>
                    </div>
                </div>
            )
        }
        else return <div></div>
    }
}

export function UsersList(props) {
    let renderedArray = []
    props.users.forEach(user => {
        renderedArray.push(<button key={user._id} className='button bg-green-500 block' onClick={() => props.addUser(user)}>{user.name} {user.surname}</button>)
    })
    return (
        <div className='block space-y-4'>
            {renderedArray}
        </div>
    )
}

export function UsersChosen(props) {
    let renderedArray = []
    props.users.forEach(user => {
        renderedArray.push(<button key={user._id} className='button bg-red-500 block mb-2' onClick={() => props.removeUser(user)}>{user.name} {user.surname}</button>)
    })
    return (
        <div className='block space-y-4'>
            {renderedArray}
        </div>
    )
}

const classAdd = async (name, teacher, users) => {
    await fetch("/api/classes", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            teacher: teacher,
            users: users
        })
    })

    return;
};