import React from 'react';
const request = require('request');

export default class Yourlendar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dues: 0
        }
    }

    getTimetableItems() {
        request.get({
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

        });
    }

    componentDidMount() {
        this.getTimetableItems();
    }

    render() {
        console.log(this.state.dues)
        return (
            /*
                <div className='p-3 inline-flex justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='w-6 mr-3' fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                    <p className='text-center text-xl'>Semaine du 13/09 au 18/09.</p>
                    <svg xmlns="http://www.w3.org/2000/svg" className='w-6 ml-3' viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" /><path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                </div>
            */
            <div className='divide-y divide-gray-900 bg-gray-700 max-w-full'>
                <div className=''>
                    {this.state.dues.length > 0 && <TimeTableItemYourlendar dues={this.state.dues} /> }
                </div>
            </div>
        )
    }
}

function TimeTableItemYourlendar(props) {
    
    let renderedArray = []

    props.dues.forEach(element => {
        renderedArray.push(
            <div key={element._id} className='border-4 border-full border-red-900 block m-8'>
                <div className='mb-4'>
                    <p className='text-yellow-600 text-3xl'>{element.keyword}</p>
                    <p className='text-indigo-600 text-xl'>{element.description}</p>
                </div>
                <div>
                    <p className='text-blue-400'>{element.teacher}</p>
                    <p className='text-pink-500'>Pour le {element.date.split('-')[2].split('T')[0]}/{element.date.split('-')[1]}/{element.date.split('-')[0]}</p>
                </div>
            </div>
        )
    });

    return (
        <div>
            {renderedArray}
        </div>
    )

}