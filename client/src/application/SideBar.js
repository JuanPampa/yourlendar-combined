import React from 'react';
import AddElement from './assets/AddElement';
import {Link} from 'react-router-dom';

function disconnect() {

    fetch("/api/users/logout", {
        method: "POST",
        mode: "cors",
        credentials: "include"
    }).then().then(data => window.location.href = '/')
    
    /*request.post({
        url: '/api/users/logout',
        withCredentials: true
    }).on('response', (res) => {
        window.location.href = '/';
    });*/
}

class TeacherSideBar extends React.Component {
    render() {
        return (        
            <div>
                <div className='p-4 m-auto space-y-6'>
                    <Link to="/timetable"><button className='button button--traditional mb-8'>Gérer vos devoirs</button></Link>
                    <Link to="/classes"><button className='button button--traditional'>Gérer vos classes</button></Link>
                </div>
                <div className='p-4 m-auto space-y-6 flex flex-col'></div>
            </div>
        )
    }
}

class SideBarMenu extends React.Component {
    constructor(props) {
        super(props);
        this.userObject = this.props.user;
        console.log(this.userObject);
    }
    
    render() {
        return (
            <div className='h-auto'>
                <div className='p-4 m-auto'> 
                <img 
                    className='m-auto p-1'
                    src='https://yourlendar-app.herokuapp.com/favicon.png' 
                    alt='Yourlendar'>
                </img>
                <h3 className='text-xl text-green-500 m-auto leading-tight mb-4'>Bonjour, {this.userObject.name} {this.userObject.surname}.</h3>
                </div>
                {this.userObject.isTeacher && <TeacherSideBar/>}
                <button 
                    className='button button--warning inline-flex items-center'
                    onClick={() => disconnect()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className='w-6 mr-1' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Se déconnecter
                </button>
            </div>
        )
    }
}


export default class SideBar extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isAddElement: false
        }
    }

    invertAddElement() {
        this.setState({isAddElement: !this.state.isAddElement})
    }

    render() {
        return (
            <div className='bg-blue-800 rounded-lg shadow-xl max-w-sm flex flex-col divide-y divide-gray-400'>
                {this.state.isAddElement && <AddElement/>}
                {!this.state.isAddElement && <SideBarMenu user={this.props.user} />}
            </div>
        )
    }

}