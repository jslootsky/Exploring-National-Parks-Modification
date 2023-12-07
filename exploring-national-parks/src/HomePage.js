import React from 'react'
import Welcome from './HomePage/Components/Welcome'
import Buttons from './HomePage/Components/Buttons'
import yosemite from './HomePage/Assets/yosemite.jpg';
import './Style/homepage.css'
import HighlightGallery from './HomePage/Components/HighlightGallery';
const HomePage = () => {
  return (
    // <Navbar/>
    <div style={{backgroundImage: `url(${yosemite})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh'}} className = "home-page main-component">
        {/* <h1>Test Hello</h1> */}
        <Welcome/>
        <HighlightGallery/>
        <Buttons/>
    </div>
  )
}

export default HomePage