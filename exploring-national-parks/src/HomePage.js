/**
 * Renders the home page of the application.
 * @component
 * @module HomePage
 * @returns {JSX.Element} The rendered home page component.
 */
import React from 'react';
import TempleTwitterTimeline from './HomePage/Components/TempleTwitterTimeline.jsx';
import Welcome from './HomePage/Components/Welcome.jsx';
import Buttons from './HomePage/Components/Buttons.jsx';
import yosemite from './HomePage/Assets/yosemite.jpg';
import TempleNews from './HomePage/Components/TempleNews.jsx';
import './Style/homepage.css';
import HighlightGallery from './HomePage/Components/HighlightGallery.jsx';
const HomePage = () => {
  return (
    // <Navbar/>
    <div className="home-page main-component">
      {/* <h1>Test Hello</h1> */}
      <Welcome />
      <section aria-labelledby="temple-alerts">
        <h2 id="temple-alerts">Temple Alerts</h2>
        <TempleTwitterTimeline
          screenName="TempleAlert"
          height="200"
          theme="light"
          chrome="noheader nofooter"
          className="twitter-wrap"
        />
      </section>
      {/*
      <TempleNews />
      */}
      <HighlightGallery />
      <Buttons />
    </div>
  );
};

export default HomePage;