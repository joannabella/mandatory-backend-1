import React from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';


function SidebarItem(props) {
    
    const deleteRoom = (event) => {
        axios.delete('http://localhost:8000/rooms/' + props.room.name)
            .then(() => {
                props.onDelete();
            })
    }
    
    return (
        <li className='room'>
            <button className='remove-room-button' onClick={deleteRoom}><i className="far fa-times-circle"></i></button>
            <NavLink to={'/rooms/'+props.room.name}><span className='hashtag'>#</span> {props.room.name}</NavLink>
        </li>
    );
}

export default SidebarItem;