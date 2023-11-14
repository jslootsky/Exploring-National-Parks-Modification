import React from 'react'

import yosemite from '../Assets/yosemite.jpg';

const Welcome = () => {
    return (
        <div style={{backgroundImage: `url(${yosemite})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', fontSize:'10rem'}}>Welcome</div>
    )
}

export default Welcome