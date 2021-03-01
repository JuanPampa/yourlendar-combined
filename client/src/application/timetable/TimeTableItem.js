import React from 'react';
import {MdDeleteForever} from "react-icons/md";

export default class TimeTableItem extends React.Component {
    constructor(props) {
        super(props);
        this.timetableItem = this.props.timetableItem;
        this.state = {
            isDeleted: false
        }
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

    render() {
        if(!this.state.isDeleted) {
            return (
                <div className='border-4 border-double border-green-500 block m-8'>
                    <div className='mt-2'>
                        <h3 className='text-yellow-700'>{this.timetableItem['keyword']}</h3>
                        <h4>Pour le {this.timetableItem['date'].split('-')[2].split('T')[0]}/{this.timetableItem['date'].split('-')[1]}/{this.timetableItem['date'].split('-')[0]}</h4>
                    </div>
                    <div className='block mb-2'>
                        <button className='button bg-red-800 inline-flex items-center mr-2' onClick={() => this.removeItem(this.timetableItem['_id'])}>
                            <MdDeleteForever size={20}/><span className='mr-2'/>Retirer<span className='mr-2'/>
                        </button>
                    </div>
                    
                </div>
            )
        } else {
            return <div></div>
        }
    }
}