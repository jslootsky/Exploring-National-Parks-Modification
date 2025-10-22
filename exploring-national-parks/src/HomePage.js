/**
 * Renders the home page of the application.
 * @component
 * @module HomePage
 * @returns {JSX.Element} The rendered home page component.
 */
import React from 'react';
import Welcome from './HomePage/Components/Welcome';
import TempleNews from './HomePage/Components/TempleNews';
import Buttons from './HomePage/Components/Buttons';
import './Style/homepage.css';
import HighlightGallery from './HomePage/Components/HighlightGallery';

const HomePage = () => {
  return (
    <div className="home-page main-component">
      <Welcome />
      <TempleNews />
      <HighlightGallery />
      <Buttons />
    </div>
  );
};

export default HomePage;
