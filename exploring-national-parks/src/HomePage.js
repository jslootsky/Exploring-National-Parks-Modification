import React from 'react'
import Welcome from './HomePage/Components/Welcome'
import yosemite from './HomePage/Assets/yosemite.jpg';
import './Style/homepage.css'
const HomePage = () => {
  return (
    // <Navbar/>
    <div style={{backgroundImage: `url(${yosemite})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', fontSize:'10rem'}} className = "home-page">
        {/* <h1>Test Hello</h1> */}
        <Welcome/>
    </div>
  )
}

export default HomePage