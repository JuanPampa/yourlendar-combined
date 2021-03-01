import React from 'react';
import SideBar from './SideBar';
import Yourlendar from './Yourlendar'

export default class ApplicationInterface extends React.Component {
    render() {
        return (
            /*
                If the window width passes the sm breakpoint, this div goes into a flex
                div, meaning that the Yourlendar react component is going next to the 
                SideBar component.
            */
           <div className='h-screen flex justify-center'>
               <div className='flex text-center m-auto max-w-full'>
                    <SideBar user={this.props.user}/>
                    <Yourlendar />
                </div>
           </div>
            
            
        )
    };
};