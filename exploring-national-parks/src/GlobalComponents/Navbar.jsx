import React from 'react'
import { NavLink } from 'react-router-dom'
const Navbar = () => {
    return (
        // create a nav bar with two links, home and parksearch
        <nav>
            <ul>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/ParkSearch">Park Search</NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar