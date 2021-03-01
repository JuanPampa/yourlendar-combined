import React from 'react';
import TimeTableAdd from './TimeTableAdd';
import TimeTableRemove from './TimeTableRemove';
const request = require('request')


export default class TimeTableManager extends React.Component {

    constructor() {
        super()
        this.state = {
            isLoaded: false,
            mode: 0
        }
    }

    componentDidMount() {
        request.get({
            url: '/api/users',
            withCredentials: true
        // On the response of the api, the callback function is executed.
        }, (err, res, body) => {
            /* 
                If the html status given back by the api is 200, we are setting those
                two booleans to true.
            */
           console.log(err)
            if(res.statusCode === 200) {
                this.userObject = JSON.parse(body); 
                return this.setState({
                    isLoaded: true
                });
            };
            /* 
                We are, here, setting the isConnected boolean to false and the
                isLoaded boolean to true in the 'this.state' object.
            */
            return this.setState({
                isLoaded: true
            });
        });
    }

    render() {
        if(this.state.isLoaded && this.userObject.teacher) {
            return (
            <div className='h-screen flex justify-center'>
                <div className='bg-gray-800 flex text-center m-auto max-w-full block'>
                    <div className='m-auto'>
                        <div className='p-4 m-auto space-y-6'>
                            <button className='button button--traditional' onClick={() => this.setState({mode: 1})}>Ajouter un devoir</button>
                        </div>
                        <div className='p-4 m-auto space-y-6'>
                            <button className='bg-yellow-600 button button--traditional' onClick={() => this.setState({mode: 2})}>Retirer un devoir</button>
                        </div>
                        <div className='p-4 m-auto space-y-6'>
                            <button className='bg-red-500 button button--traditional' onClick={() => this.setState({mode: 0})}>Fermer </button>
                        </div>
                    </div>

                    {this.state.mode === 1 && <TimeTableAdd username={this.userObject.username}/>}
                    {this.state.mode === 2 && <TimeTableRemove />}
                </div>
           </div>
            )
        } else {
            return (
                <div>
                    <h1> Chargement... </h1>
                </div>
            )
        }
    }    
}