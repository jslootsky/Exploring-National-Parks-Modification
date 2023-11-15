import React from 'react'

const Buttons = () => {
    return (
        <div className = "homepage-button-wrapper">
                <button className = "homepage-button" onClick = {() => handleClick("search")}>Park Search</button>
                <button className = "homepage-button" onClick = {() => handleClick("plan")}>Plan A Trip</button>
        </div>
    )
}

function handleClick(buttonType) {
    buttonType === "search" ? window.location.href = "/parksearch" : console.log("plan");
}

export default Buttons