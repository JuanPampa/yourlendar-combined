import React from 'react';
import {AiOutlineArrowUp, AiOutlineArrowDown} from 'react-icons/ai'

export default class Yourlendar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dues: 0,
            numberStart: 0
        }
    }

    getTimetableItems() {

        fetch("/api/timetable", {
            method: "GET",
            mode: "cors",
            credentials: "include"
        }).then(res => {return res.text()}).then(data => this.setState({dues: JSON.parse(data)}));

        /*request.get({
            url: '/api/timetable',
            withCredentials: true
        }, (err, res, body) => {

            if(res.statusCode === 200) {
                this.userObject = JSON.parse(body); 
                return this.setState({
                    dues: JSON.parse(body)
                });
            };

            return this.setState({
                dues: [0]
            })
            */

    }

    componentDidMount() {
        this.getTimetableItems();
    }

    changeNumberStart(k) {
        if(k === 1) {
            if(this.state.numberStart > 0) {
                return this.setState({numberStart: this.state.numberStart - 1});
            }
        } else if(k === 2) {
            if(this.state.numberStart <= this.state.dues.length - 5) {
                return this.setState({numberStart: this.state.numberStart + 1});
            }
        }
    }

    render() {
        if(this.state.dues.length > 0) {
            if(this.state.dues.length > 5) {
                return (
                    /*
                        <div className='p-3 inline-flex justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='w-6 mr-3' fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                            <p className='text-center text-xl'>Semaine du 13/09 au 18/09.</p>
                            <svg xmlns="http://www.w3.org/2000/svg" className='w-6 ml-3' viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" /><path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                        </div>
                    */
                    <div className='divide-y divide-gray-900 bg-gray-700 max-w-full border-solid rounded-xl'>
                        <div>
                            <button 
                                className="w-full button bg-indigo-500"
                                onClick={() => this.changeNumberStart(1)}>
                                <span className="flex justify-center"><AiOutlineArrowUp/></span>
                            </button>
                        </div>
                        <div className=''>
                            <TimeTableRender key="render" dues={this.state.dues} numberStart={this.state.numberStart} numberEnd={this.state.numberStart + 3}/>
                        </div>
                        <div>
                            <button 
                                className="w-full button bg-indigo-500" 
                                onClick={() => this.changeNumberStart(2)}>
                                <span className="flex justify-center"><AiOutlineArrowDown/></span>
                            </button>
                        </div>
                    </div>
                )   
            } else {
                return (
                    <div className='divide-y divide-gray-900 bg-gray-700 max-w-full border-solid rounded-xl'>
                        <div className=''>
                            {this.state.dues.length > 0 && <TimeTableRender key="render" dues={this.state.dues} numberStart={0} numberEnd={this.state.dues.length - 1}/>}
                        </div>
                    </div>
                )
            }
        } else {
            return <div></div>
        }
    }
}





function TimeTableRender(props) {
    let renderedArray = []
    for(let i = props.numberStart; i <= props.numberEnd; i++) {
        for(let k = 0; k < props.dues[i].length; k++) {
            renderedArray.push(<TimeTableItemYourcenar key={props.dues[i][k]._id} due={props.dues[i][k]}/>)
        }
        
    }

    return <div>{renderedArray}</div>
}
class TimeTableItemYourcenar extends React.Component {

    constructor(props) {
        super(props);
        this.due = this.props.due;
    }

    render () {
        return (
            <div 
                key={this.due._id} 
                className='bg-gradient-to-r from-blue-800 to-gray-700 border-2 border-opacity-25 rounded-md divide-y border-indigo-100 block m-8'
                onClick={this.showMenu}    
            >
                <div className='pb-2'>
                    <p className='text-yellow-700 text-3xl'>{this.due.keyword}</p>
                    <p className='text-gray-600 text-xl'>{this.due.description}</p>
                </div>
                <div className='pt-2'>
                    <p className='text-blue-400'>Professeur: {this.due.teacher.name.toUpperCase()}</p>
                    <p className='text-purple-400'>Pour le {this.due.date.split('-')[2].split('T')[0]}/{this.due.date.split('-')[1]}/{this.due.date.split('-')[0]}</p>
                </div>
            </div>
        )
    }
}