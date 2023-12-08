/**
 * Renders a navigation bar component with links to different pages.
 * @returns {JSX.Element} The rendered navigation bar component.
 */
import React from 'react'
import { NavLink } from 'react-router-dom'
import '../Style/navbar.css'
const Navbar = () => {
    return (
        <nav className="nav-bar">
            <ul>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/ParkSearch">Park Search</NavLink>
                </li>
                <li>
                    <NavLink to="/ParkInfo" reloadDocument>Park Info</NavLink>
                </li>
                <li>
                    <NavLink to="/ParkPlan">Plan A Trip</NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar