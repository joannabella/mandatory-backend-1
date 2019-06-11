import React, { useState, useEffect } from 'react';
import SidebarItem from './SidebarItem';
import axios from 'axios';

function Sidebar() {
    const [data, setData] = useState({
        rooms: [],
        newRoom: '',
    });

    const createRoom = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8000/rooms', {
            name: data.newRoom
        })
        .then(() => {
            setData({
                rooms: [...data.rooms],
                newRoom: ''
            })
            loadRooms();
        })
    }

    const loadRooms = () => {
        return axios.get('http://localhost:8000/rooms')
            .then(response => setData({
                rooms: response.data
            }))    
    }

    useEffect(() => {
       loadRooms();
    }, []);
    
    return (
        <nav className='navbar-rooms'>
            <form onSubmit={createRoom}>
                <div className='add-room-container'>
                    <input className='add-room' value={data.newRoom} onChange={event => setData({...data, newRoom: event.target.value})} placeholder='#room' spellCheck='false'></input>
                    <button className='add-room-button' type='submit'>add</button> 
                </div>
            </form>
            <div className='navbar-menu-container'>
                <ul className='navbar-menu'>
                    {data.rooms.map(room => {
                        return <SidebarItem room={room} key={room.name} onDelete={() => loadRooms()} />
                    })}
                </ul>
            </div>
        </nav>
    );
}

export default Sidebar;