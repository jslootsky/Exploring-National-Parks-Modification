import React from 'react'

import yosemite from '../Assets/yosemite.jpg';

const Welcome = () => {
    return (
        <div style={{backgroundImage: `url(${yosemite})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', fontSize:'10rem'}}>
            <h5 className = "welcome-title">National Parks Explorer</h5>
            <button>Park Search</button>
            <button>Plan A Trip</button>
            </div>
    )
}

export default Welcome