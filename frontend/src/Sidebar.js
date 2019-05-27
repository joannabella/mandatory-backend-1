import React, { useState, useEffect } from 'react';
import SidebarItem from './SidebarItem';
import axios from 'axios';

function Sidebar() {
    const [data, setData] = useState({ rooms: [] });

    useEffect(() => {
        async function getRooms() {
            return axios.get('http://localhost:8000/rooms')
        }

        getRooms().then(response => setData({
            rooms: response.data
        }))
    });


    return (
        <ul>
            {data.rooms.map(room => {
                return <SidebarItem room={room} />;
            })}
        </ul>
    );
}

export default Sidebar;