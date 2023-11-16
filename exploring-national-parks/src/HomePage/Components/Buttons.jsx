import React from 'react'
import { Link } from 'react-router-dom'
const Buttons = () => {
    return (
        <div className = "homepage-button-wrapper">
                {/* <button className = "homepage-button" onClick = {() => handleClick("ParkSearch")}>Park Search</button>
                <button className = "homepage-button" onClick = {() => handleClick("ParkPlan")}>Plan A Trip</button> */}
                <button className="homepage-button">
                    <Link  to='/ParkSearch'>Park Search</Link>
                </button>
                <button className="homepage-button">
                    <Link className="homepage-button" to='/ParkPlan'>Plan A Trip</Link>
                </button>
        </div>
    )
}


export default Buttons