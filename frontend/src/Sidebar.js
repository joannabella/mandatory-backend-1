import React, { useState, useEffect } from 'react';
import SidebarItem from './SidebarItem';
import axios from 'axios';

function Sidebar() {
    const [data, setData] = useState({ rooms: [] });

    useEffect(() => {
        async function getRooms() {
            await axios.get('http://localhost:8000/rooms')
        }

        getRooms().then(rooms => setData({
            rooms: rooms
        }))
    });

    return (
        <ul>
            {data.rooms.map(room => {
                return <SidebarItem />;
            })}
        </ul>
    );
}

export default Sidebar;