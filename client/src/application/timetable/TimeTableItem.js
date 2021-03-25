import React from 'react';
import {UsersChosen, UsersList, ClassChosen, ClassList} from './TimeTableAdd'
import SearchBox from '../SearchBox';
import {MdDeleteForever, MdModeEdit, MdUndo} from "react-icons/md";

export default class TimeTableItem extends React.Component {
    constructor(props) {
        super(props);
        this.timetableItem = this.props.timetableItem;
        this.usersAvoidDouble = false;
        this.classesAvoidDouble = false;
        this.state = {
            isDeleted: false,
            isModify: false,
            users: [],
            classes: [],
            isMessageVisible: false,
            searchBar: "",
            timetableItem: this.props.timetableItem,
            keyword: this.timetableItem.keyword,
            description: this.timetableItem.description
        }
    }

    getAllUsers() {
        fetch("/api/users/students", {
            method: "GET",
            mode: "cors",
            credentials: "include"
        }).then(res => {return res.text()}).then((data) => {
            JSON.parse(data).forEach((user) => {
                this.state.timetableItem.users.forEach(userClass => {
                    if(userClass.username === user.username) this.usersAvoidDouble = true;
                })
                if(!this.usersAvoidDouble) this.setState({users: this.state.users.concat([user])});
                this.usersAvoidDouble = false;
            })
        })

        fetch("/api/classes", {
            method: "GET",
            mode: "cors",
            credentials: "include"
        }).then(res => {return res.text()}).then((data) => {
            JSON.parse(data).forEach((classItem) => {
                this.state.timetableItem.classes.forEach(classItemForEach => {
                    if(classItemForEach._id === classItem._id) this.classesAvoidDouble = true;
                });
                if(!this.classesAvoidDouble) this.setState({classes: this.state.classes.concat([classItem])});
                this.classesAvoidDouble = false;
            })
        })
    }

    modifyItem(timetableItem, keyword, description, date) {
        
        if(Date.parse(date)-Date.parse(new Date())<0) {
            return this.handleError("Date incorrecte.")
        };

        timetableItem.keyword = keyword;
        timetableItem.description = description;
        timetableItem.date = date;
        fetch("/api/timetable/modify", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(timetableItem)
        })

        return this.setState({isModify: false});
    }

    removeItem(id) {

        fetch("/api/timetable", {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: id
            })
        })

        window.location.href = "/timetable";

        return this.setState({isDeleted: true});
    }

    addUser(userCho) {
        this.setState({users: this.state.users.filter(user => user.username !== userCho.username)});
        this.setState({timetableItem: {
            _id: this.state.timetableItem._id,
            keyword: this.state.timetableItem.keyword,
            description: this.state.timetableItem.description,
            date: this.state.timetableItem.date,
            teacher: this.state.timetableItem.teacher,
            classes: this.state.timetableItem.classes,
            users: this.state.timetableItem.users.concat([userCho])
        }});
    }

    removeUser(userCho) {
        this.setState({timetableItem: {
            _id: this.state.timetableItem._id,
            keyword: this.state.timetableItem.keyword,
            description: this.state.timetableItem.description,
            date: this.state.timetableItem.date,
            teacher: this.state.timetableItem.teacher,
            classes: this.state.timetableItem.classes,
            users: this.state.timetableItem.users.filter(user => user.username !== userCho.username)
        }});
        this.setState({users: this.state.users.concat([userCho])});
    }

    addClass(classEntered) {
        this.setState({timetableItem: {
            _id: this.state.timetableItem._id,
            keyword: this.state.timetableItem.keyword,
            description: this.state.timetableItem.description,
            date: this.state.timetableItem.date,
            teacher: this.state.timetableItem.teacher,
            classes: this.state.timetableItem.classes.concat([classEntered]),
            users: this.state.timetableItem.users
        }});
        this.setState({classes: this.state.classes.filter(classItem => !(classItem._id === classEntered._id))});
    }

    removeClass(classEntered) {
        this.setState({timetableItem: {
            _id: this.state.timetableItem._id,
            keyword: this.state.timetableItem.keyword,
            description: this.state.timetableItem.description,
            date: this.state.timetableItem.date,
            teacher: this.state.timetableItem.teacher,
            classes: this.state.timetableItem.classes.filter(classItem => !(classItem._id === classEntered._id)),
            users: this.state.timetableItem.users
        }});
        this.setState({classes: this.state.classes.concat([classEntered])});
    }

    handleError(message) {
        this.setState({isMessageVisible: true})
        document.getElementById("yourlendar-error.message").innerHTML = message;
    }

    changeModify() {
        return this.setState({isModify: !this.state.isModify});
    }

    componentDidMount() {
        this.getAllUsers();
    }

    render() {
        const {users, searchBar} = this.state;
        const filteredUsers = users.filter(user => (user.surname.toLowerCase() + ' ' + user.name.toLowerCase()).includes(searchBar.toLowerCase()))

        if(!this.state.isDeleted) {
            if(this.state.isModify) {   
                return (
                    <div className='border-4 border-double border-green-500 m-8'>

                        <h1 className="text-3xl">Modifier le devoir</h1>
                        <h1 className="text-3xl text-yellow-500 m-2">{this.state.timetableItem.keyword}</h1>
                        
                        <div className="m-10">
                            <div className="pb-4">
                                <input className='login-form-input pb-4 w-full' id='timetableItem-keyword' spellCheck='false' type='text' value={this.state.keyword} onChange={(e) => this.setState({keyword: e.target.value})} placeholder="Nom du devoir"></input>
                            </div>
                            <div className="pb-4"> 
                                <input className='login-form-input pb-4 w-full' id='timetableItem-description' spellCheck='false' type='text' value={this.state.description} onChange={(e) => this.setState({description: e.target.value})} placeholder="Description du devoir"></input>
                            </div>
                            <div className="pb-4">
                                <input className='login-form-input pb-4 w-full' id='timetableItem-date' type='date' defaultValue={this.state.timetableItem.date.split('T')[0]}></input>
                            </div>
                        </div>
                        
                        <div className="flex">
                            <div className='m-10'>
                                {this.state.timetableItem.users.length > 0 && <UsersChosen users={this.state.timetableItem.users} removeUser={(userCho) => this.removeUser(userCho)}/>}
                                <div className='mb-3'>
                                    <SearchBox placeholder='Recherchez un élève' handleChange={(e) => this.setState({searchBar: e.target.value})}/>
                                </div>
                                {this.state.searchBar.length > 0 && <UsersList users={filteredUsers} addUser={(userCho) => this.addUser(userCho)}/>}
                            </div>

                            <div className='m-10'>
                                <h3 className="text-red-500">Classes choisies:</h3>
                                <ClassChosen classes={this.state.timetableItem.classes} removeClass={(classItem) => this.removeClass(classItem)}/>
                                <h3 className="text-green-500">Classes pouvant être choisies:</h3>
                                <ClassList classes={this.state.classes} addClass={(classItem) => this.addClass(classItem)}/>
                            </div>
                        </div>
                        
                        <div className="m-10">
                            <div className='m-5 flex justify-center'>
                                <button className="button flex bg-blue-700" onClick={() => this.modifyItem(this.state.timetableItem, document.getElementById("timetableItem-keyword").value, document.getElementById("timetableItem-description").value, document.getElementById("timetableItem-date").value)}><MdModeEdit size={20}/>  <span className="pl-2">Modifier la classe</span></button>
                            </div>
                            <div className='m-5 flex justify-center'>
                                <button className="button flex bg-red-900" onClick={() => this.setState({isModify: false})}><MdUndo size={20}/>  <span className="pl-2">Retour</span></button>
                            </div>
                        </div>

                        <div className={`m-10, ${this.state.isMessageVisible ? "visible" : "hidden"}`}>
                            <h3 id="yourlendar-error-message" className="text-red-400">ERREUR</h3>
                        </div>

                    </div>
                )
            } else {
                return (
                    <div className='border-4 border-double border-green-500 block m-8'>
                        <div className='m-5 mt-2'>
                            <h3 className='text-yellow-700'>{this.state.timetableItem.keyword}</h3>
                            <h4>Pour le {this.state.timetableItem.date.split('-')[2].split('T')[0]}/{this.state.timetableItem.date.split('-')[1]}/{this.state.timetableItem.date.split('-')[0]}</h4>
                        </div>
                        <button className='button bg-blue-800 inline-flex items-center mt-4 mr-2 mb-3' onClick={() => this.changeModify()}>
                            <MdModeEdit size={20}/><span className='mr-2'/>Modifier<span className='mr-2'/>
                        </button>
                        <div className='block mb-2'>
                            <button className='button bg-red-800 inline-flex items-center mr-2' onClick={() => this.removeItem(this.state.timetableItem._id)}>
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