import React from 'react'

import yosemite from '../Assets/yosemite.jpg';

const Welcome = () => {
    return (
        <div style={{backgroundImage: `url(${yosemite})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', fontSize:'10rem'}}>
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