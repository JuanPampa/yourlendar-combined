import React from 'react';

export default function SearchBox(props) {
    return ( 
        <input
            type = 'search'
            className = 'w-max p-2'
            placeholder = {props.placeholder}
            onChange = {props.handleChange}
        />
    )
}