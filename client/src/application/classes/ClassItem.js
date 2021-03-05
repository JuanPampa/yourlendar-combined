import React from 'react';
import {UsersList, UsersChosen} from './ClassesAdd';
import SearchBox from '../SearchBox'
import {MdDeleteForever, MdModeEdit} from "react-icons/md";

export default class ClassItem extends React.Component {
    constructor(props) {
        super(props);
        this.usersAvoidDouble = false;
        this.state = {
            users: [],
            searchBar: "",
            classItem: this.props.classItem,
            isDeleted: false,
            isModify: false
        }
    }

    getAllUsers() {
        fetch("/api/users/students", {
            method: "GET",
            mode: "cors",
            credentials: "include"
        }).then(res => {return res.text()}).then((data) => {

            JSON.parse(data).forEach((user) => {
                this.state.classItem.users.forEach(userClass => {
                    if(userClass.username === user.username) {
                        this.usersAvoidDouble = true;
                    }
                })
                if(!this.usersAvoidDouble) {this.setState({users: this.state.users.concat([user])})}
                this.usersAvoidDouble = false;
            })
            
            return this.setState({isLoaded: true})
        })
    }

    removeItem(id) {

        fetch("/api/classes", {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: id
            })
        }).then().then(() => this.setState({isDeleted: true}));

        /*request.delete({
            url: "/api/timetable",
            withCredentials: true,
            json: true,
            body: {
                _id: id
            }
            }, (err, res, body) => {
                if(res.statusCode === 200) {
                    this.setState({isDeleted: true})
                }
            })*/
    }

    addUser(userCho) {
        this.setState({users: this.state.users.filter(user => user.username !== userCho.username)});
        this.setState({classItem: {
            _id: this.state.classItem._id,
            name: this.state.classItem.name,
            teacher: this.state.classItem.teacher,
            users: this.state.classItem.users.concat([userCho])
        }});
    }

    removeUser(userCho) {
        this.setState({classItem: {
            _id: this.state.classItem._id,
            name: this.state.classItem.name,
            teacher: this.state.classItem.teacher,
            users: this.state.classItem.users.filter(user => user.username !== userCho.username)
        }});
        this.setState({users: this.state.users.concat([userCho])});
    }


    changeModify() {
        return this.setState({isModify: !this.state.isModify});
    }

    componentDidMount() {
        this.getAllUsers();
    }

    modifyItem(classItem, className) {
        classItem.users.forEach(user => {
            delete user._id; 
        })
        classItem.name = className;
        fetch("/api/classes/modify", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(classItem)
        }).then().then(() => this.setState({isModify: false}));
    }

    render() {
        const {users, searchBar} = this.state;
        const filteredUsers = users.filter(user => (user.surname.toLowerCase() + ' ' + user.name.toLowerCase()).includes(searchBar.toLowerCase()))

        if(!this.state.isDeleted) {
            if(this.state.isModify) {
                return (
                    <div className='border-4 border-double border-green-500 m-8'>

                        <h1 className="text-3xl mb-4"> Modifier la classe <span className="text-yellow-500">{this.state.classItem.name}</span> </h1>

                        <input className='login-form-input' id='class-name' spellCheck='false' type='text' value={this.state.classItem.name} placeholder="Nom de la classe"></input>

                        <div className='m-10'>
                            <h3 className="text-red-500">Élèves choisis:</h3>
                            {this.state.classItem.users.length > 0 && <UsersChosen users={this.state.classItem.users} removeUser={(userCho) => this.removeUser(userCho)}/>}
                            <div className='mb-3'>
                                <SearchBox placeholder='Recherchez un élève' handleChange={(e) => this.setState({searchBar: e.target.value})}/>
                            </div>
                            <h3 className="text-green-500">Élèves pouvant être choisis:</h3>
                            {this.state.searchBar.length > 0 && <UsersList users={filteredUsers} addUser={(userCho) => this.addUser(userCho)}/>}
                        </div>

                        <div className='m-10'>
                            <button id='submit-button' onClick={() => this.modifyItem(this.state.classItem, document.getElementById('class-name').value)}>Modifier la classe</button>
                        </div>

                    </div>
                )
            } else {
                return (
                    <div className='border-4 border-double border-green-500 m-8'>
                        <div className='mt-2'>
                            <h3 className='text-yellow-700'>{this.state.classItem.name}</h3>
                        </div>
                        <div className='space-y-4 block mb-2'>
                            <button className='button bg-blue-800 inline-flex items-center mr-2' onClick={() => this.changeModify()}>
                                <MdModeEdit size={20}/><span className='mr-2'/>Modifier<span className='mr-2'/>
                            </button>
                            <button className='button bg-red-800 inline-flex items-center mr-2' onClick={() => this.removeItem(this.state.classItem._id)}>
                                <MdDeleteForever size={20}/><span className='mr-2'/>Retirer<span className='mr-2'/>
                            </button>
                        </div>
                        
                    </div>
                )
            }
        } else {
            return <div></div>
        }
    }
}