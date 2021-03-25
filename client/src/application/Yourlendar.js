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
    // We are creating an array concatenating all the arrays located in props.dues.
    let fullArray = [].concat.apply([], props.dues)
    let renderedArray = []

    // Sorting the array by the date with a sorting function.
    fullArray.sort((a,b) => {return new Date(b.date) - new Date(a.date)});
    
    for(let k = 0; k < fullArray.length; k++) {
        if(Date.parse(fullArray[k].date) - Date.parse(new Date()) < 0) {
            fetch("/api/timetable", {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _id: fullArray[k]._id
                })
            })
            continue;
        }
        renderedArray.push(<TimeTableItemYourcenar key={fullArray[k]._id} due={fullArray[k]}/>)
    }

    renderedArray = renderedArray.reverse()
    return <div>{renderedArray}</div>
}
class TimeTableItemYourcenar extends React.Component {

    constructor(props) {
        super(props);
        this.due = this.props.due;
    }

    render () {
        console.log(this.due.teacher)
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