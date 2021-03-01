import React from 'react';
import TimeTableItem from './TimeTableItem';

export default class TimeTableRemove extends React.Component {
    
    constructor() {
        super()
        this.renderedItems = [];
        this.state = {
            dataLoaded: false
        }
    }

    componentDidMount() {
        this.requestTimeTable();
    }

    requestTimeTable() {

        fetch("/api/timetable", {
            method: "GET",
            mode: "cors",
            credentials: "include"
        }).then(res => {return res.text()}).then((data) => {

            this.timetableItems = JSON.parse(data)

            for(let i = 0; i < this.timetableItems.length; i++) {
                this.renderedItems.push(<TimeTableItem key={this.timetableItems[i]._id} timetableItem={this.timetableItems[i]} />)
            }
            
            return this.setState({
                dataLoaded: true
            });
        })

        /*request.get({
            url: '/api/timetable',
            withCredentials: true
        }, (err, res, body) => {

            if(res.statusCode === 200) {
                this.timetableItems = JSON.parse(body); 
            };

            for(let i = 0; i < this.timetableItems.length; i++) {
                this.renderedItems.push(<TimeTableItem key={this.timetableItems[i]._id} timetableItem={this.timetableItems[i]} />)
            }

            return this.setState({
                dataLoaded: true
            });
        })*/
    }

    createTimetableList() {
    }

    render() {
        if(this.state.dataLoaded) {
            return <div className='m-auto ml-6 mr-6'>{this.renderedItems}</div>
        } 
        else return <div></div>
    }
}