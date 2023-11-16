import React from 'react';
import ReactDOM from 'react-dom/client';
import ParkSearch from './ParkSearch.js';
import ParkInfo from './ParkInfo.js';
import HomePage from './HomePage.js';
import Navbar from './GlobalComponents/Navbar.jsx';
import {BrowserRouter as Router, Routes,Route} from "react-router-dom";

import './Style/main.css';

import Footer from 'rc-footer';
import 'rc-footer/assets/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <div>
        <Router basename='Exploring-National-Parks'>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/ParkSearch" element={<ParkSearch />} />
                <Route path="/ParkInfo" element={<ParkInfo />} />
            </Routes>
            
        </Router>

        <Footer
        columns={[
        {
            icon: (
            <img src="https://web.archive.org/web/20091027005003im_/http://it.geocities.com/aniellobarra/Img/Clip/Animated/tree.gif" alt="" />
            ),
            title: 'Exploring National Parks',
            url: 'https://google.com',
            description: 'Placeholder link',
            openExternal: true,
        },
        ]}
        bottom="Copyright 2023"
        theme="light"
        />
    </div>
);


// const activities = ReactDOM.createRoot(document.getElementById('activitiesDropdown'));
// activities.render(
//     <Activities />
// );


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

