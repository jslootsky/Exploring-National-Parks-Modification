import React from 'react'
import { NavLink } from 'react-router-dom'
import '../Style/navbar.css'
import tree from './tree.png'
const Navbar = () => {
    return (
        // create a nav bar with two links, home and parksearch
        <nav className="nav-bar">
            <ul>
                <li className = "header">
                    <NavLink to="/">Exploring National Parks</NavLink>
                </li>
                <li className = "logo">
                    <img src = {tree} alt = "tree"/>
                </li>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/ParkSearch">Park Search</NavLink>
                </li>
                <li>
                    <NavLink to="/ParkInfo">Park Info</NavLink>
                </li>
                <li>
                    <NavLink to="/ParkPlan">Park Planner</NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar