/**
 * Renders the home page of the application.
 * @component
 * @module HomePage
 * @returns {JSX.Element} The rendered home page component.
 */
import React from 'react';
import Welcome from './HomePage/Components/Welcome.jsx';
import Buttons from './HomePage/Components/Buttons.jsx';
import TempleTwitterTimeline from './HomePage/Components/TempleTwitterTimeline.jsx';
import TempleNews from './HomePage/Components/TempleNews.jsx';
import './Style/homepage.css';
import HighlightGallery from './HomePage/Components/HighlightGallery.jsx';
const HomePage = () => {
  return (
    // <Navbar/>
    <div className="home-page main-component">
      {/* <h1>Test Hello</h1> */}
      <Welcome />
      <TempleNews /> 
      <HighlightGallery />
      <Buttons />
    </div>
  );
};

export default HomePage;