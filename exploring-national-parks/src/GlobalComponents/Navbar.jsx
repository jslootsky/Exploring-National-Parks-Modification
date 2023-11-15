import React from 'react'
import { NavLink } from 'react-router-dom'
import '../Style/navbar.css'
const Navbar = () => {
    return (
        // create a nav bar with two links, home and parksearch
        <nav className="nav-bar">
            <ul>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/ParkSearch">Park Search</NavLink>
                </li>
                <li>
                    <NavLink to="/parkinfo">Park Info</NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar