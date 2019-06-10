import React from 'react';
import { Link } from 'react-router-dom';
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
            <Link to={'/rooms/'+props.room.name}><span className='hashtag'>#</span> {props.room.name}</Link>
        </li>
    );
}

export default SidebarItem;