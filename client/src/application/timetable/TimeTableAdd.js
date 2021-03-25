import React from 'react';
import SearchBox from '../SearchBox';
import {MdAddCircle} from 'react-icons/md'
export default class TimeTableAdd extends React.Component {
    constructor(props) {
        super(props);
        this.teacher = {
            username: this.props.teacher.username,
            name: this.props.teacher.name
        };
        this.state = {
            isLoaded: false,
            errorMessage: {
                isMessageVisible: false,
                messageContent: ""
            },
            searchBar: "",
            users: [],
            classes: [],
            usersChosen: [],
            classesChosen: []
        }
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
        })

        fetch("/api/classes", {
            method: "GET",
            mode: "cors",
            credentials: "include"
        }).then(res => {return res.text()}).then((data) => {
            JSON.parse(data).forEach((classItem) => {
                this.setState({classes: this.state.classes.concat([classItem])})
            })
            
            this.setState({isLoaded: true})
        })

        return;
    }
    
    addUser(userEntered) {
        this.setState({users: this.state.users.filter(user => !(user.username === userEntered.username))});
        this.setState({usersChosen: this.state.usersChosen.concat([userEntered])});
    }

    removeUser(userEntered) {
        this.setState({usersChosen: this.state.usersChosen.filter(user => !(user.username === userEntered.username))});
        this.setState({users: this.state.users.concat([userEntered])});
    }

    addClass(classEntered) {
        this.setState({classes: this.state.classes.filter(classItem => !(classItem._id === classEntered._id))});
        this.setState({classesChosen: this.state.classesChosen.concat([classEntered])});
    }

    removeClass(classEntered) {
        this.setState({classesChosen: this.state.classesChosen.filter(classItem => !(classItem._id === classEntered._id))});
        this.setState({classes: this.state.classes.concat([classEntered])});
    }

    handleError(message) {
        this.setState({
            isMessageVisible: true, 
            errorMessage: {
                messageContent: message
            } 
        })
    }

    addTimeTableItem(keyword, description, date) {
        
        if(Date.parse(date)-Date.parse(new Date())<0) {
            return this.handleError("Date incorrecte.")
        };

        this.state.classesChosen.map(classItem => classItem._id);
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
                teacher: this.teacher,
                users: this.state.usersChosen,
                classes: this.state.classesChosen
            })
        })
        
        window.location.href = "/timetable";

        return this.setState({isLoaded: false})

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
        const filteredUsers = users.filter(user => (user.surname.toLowerCase() + ' ' + user.name.toLowerCase()).includes(searchBar.toLowerCase()))

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
                    <div className="flex">
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
                            <h3 className="text-red-500">Classes choisies:</h3>
                            <ClassChosen classes={this.state.classesChosen} removeClass={(classItem) => this.removeClass(classItem)}/>
                            <h3 className="text-green-500">Classes pouvant être choisies:</h3>
                            <ClassList classes={this.state.classes} addClass={(classItem) => this.addClass(classItem)}/>
                        </div>
                    </div>
                    
                    
                    <div className='m-10'>
                        <button className="button bg-yellow-800 flex" onClick={() => this.addTimeTableItem(document.getElementById("timetable-keyword").value, document.getElementById("timetable-description").value, document.getElementById("timetable-date").value)}><MdAddCircle size={20} /> <span className="pl-2">Créer le devoir</span></button>
                    </div>
                
                    <div className={`m-10, ${this.state.isMessageVisible ? "visible" : "hidden"}`}>
                        <h3 id="yourlendar-error-message" className="text-red-400">{this.state.errorMessage.messageContent}</h3>
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

export function ClassList(props) {
    let renderedArray = []
    props.classes.forEach(classItem => {
        renderedArray.push(<button key={classItem._id} className='button bg-green-500 block' onClick={() => props.addClass(classItem)}>{classItem.name}</button>)
    })
    return (
        <div className='block space-y-4'>
            {renderedArray}
        </div>
    )
}

export function ClassChosen(props) {
    let renderedArray = []
    props.classes.forEach(classItem => {
        renderedArray.push(<button key={classItem._id} className='button bg-red-500 block mb-2' onClick={() => props.removeClass(classItem)}>{classItem.name}</button>)
    })
    return (
        <div className='block space-y-4'>
            {renderedArray}
        </div>
    )
}