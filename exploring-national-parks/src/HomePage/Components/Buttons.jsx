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

function handleClick(buttonType) {
    buttonType === "search" ? window.location.href = "/parksearch" : console.log("plan");
}

export default Buttons