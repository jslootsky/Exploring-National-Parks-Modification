// ActivitiesComponent.jsx
import React, { useState, useEffect } from 'react';
import { Activities } from '../Functionality/Activities'; // Importing the functionality
import Select from 'react-select';
import makeAnimated from 'react-select/animated'
import '../../Style/activitiesList.css';

function ActivitiesList() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const json = await Activities();
                console.log(json);
                setPosts(json.data);
            } catch (error) {
                // Handle the error, if needed
            }
        };

        fetchData();
    }, []);

    //Get list of activities in correct form for dropdown
    const activities = posts?.map((post) => { return {value: post.name, label: post.name} });
    const animatedComponents = makeAnimated()

    return (
        <div className='activitiesList'>

            <center>
                <h1 id = "search-title">Search for a Park</h1>
                
                <div className = "search-about">
                    <p>
                        Welcome to the Parks Finder Application! Select an activity below to begin finding the perfect park for you:
                    </p>
                <input type="text" placeholder="Search for activities..." id="activityInput"></input>
                </div>
            </center>
            <div className="ActivityDropdown">
            <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
                options={activities}
            />
            </div>
            <br></br>
            <div class="search-button-wrapper">
                <a href="./"><button class="search-button">Return To Home</button></a>
                <a href="./"><button class="search-button">Plan A Trip</button></a>
            </div>
            
        </div>
    );
}

export default ActivitiesList;
