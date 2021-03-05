import React from 'react';
import ClassItem from './ClassItem'

export default class ClassesModify extends React.Component {
    constructor(){
        super();
        this.classItems = {};
        this.renderedItems = [];
        this.state = {
            dataLoaded: false
        }
    }

    requestClasses() {
        fetch("/api/classes", {
            method: "GET",
            mode: "cors",
            credentials: "include"
        }).then(res => {return res.text()}).then((data) => {

            this.classItems = JSON.parse(data)

            for(let i = 0; i < this.classItems.length; i++) {
                this.renderedItems.push(<ClassItem key={this.classItems[i]._id} classItem={this.classItems[i]} />)
            }
            
            return this.setState({dataLoaded: true});
        })
    }

    componentDidMount() {
        this.requestClasses();
    }

    render() {
        if(this.state.dataLoaded) {
            return <div className='m-auto ml-6 mr-6'>{this.renderedItems}</div>
        } 
        else return <div></div>
    }
}