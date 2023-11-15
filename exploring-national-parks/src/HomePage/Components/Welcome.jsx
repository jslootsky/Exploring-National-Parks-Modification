import React from 'react'



const Welcome = () => {
    return (
        <div>
            <h5 className = "welcome-title">National Parks Explorer</h5>
            <div className = "homepage-button-wrapper">
                <button className = "homepage-button" onClick = {() => handleClick("search")}>Park Search</button>
                <button className = "homepage-button" onClick = {() => handleClick("plan")}>Plan A Trip</button>
            </div>
        </div>
    )
}

function handleClick(buttonType) {
    buttonType === "search" ? window.location.href = "/parksearch" : console.log("plan");
}

export default Welcome