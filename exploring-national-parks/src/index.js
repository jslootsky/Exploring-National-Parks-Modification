import React from 'react';
import ReactDOM from 'react-dom/client';
// import Activities from './NPSAPI.js';
import ParkSearch from './ParkSearch.js';
import HomePage from './HomePage.js';
import Navbar from './GlobalComponents/Navbar.jsx';
import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import Footer from './GlobalComponents/Footer.jsx';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router basename="/Exploring-National-Parks">
        <Navbar />
        <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/ParkSearch" element={<ParkSearch />} />
        </Routes>
        <Footer/>
    </Router>
   
);

// const activities = ReactDOM.createRoot(document.getElementById('activitiesDropdown'));
// activities.render(
//     <Activities />
// );


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

