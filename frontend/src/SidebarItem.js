import React from 'react';

function SidebarItem(props) {
    return (
        <li>
            {props.room.name}
        </li>
    );
}

export default SidebarItem;