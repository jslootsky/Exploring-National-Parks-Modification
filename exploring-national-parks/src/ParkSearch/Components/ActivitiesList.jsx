// ActivitiesComponent.jsx
import React, { useState, useEffect } from 'react';
import { Activities } from '../Functionality/Activities'; // Importing the functionality
import Select from 'react-select';
import makeAnimated from 'react-select/animated'
import '../../Style/activitiesList.css';
import { Link } from 'react-router-dom';
import { FetchParks } from '../Functionality/FetchParks';
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
    const activities = posts?.map((post) => { return { value: post.name, label: post.name } });
    const animatedComponents = makeAnimated()
    const [selectedOption, setSelectedOption] = useState(null);
    const [parksFiltered, setParksFiltered] = useState(null);
    const sendToAPI = () => {
        // console.log("selected option below");
        console.log(selectedOption);
        try{
            setParksFiltered(FetchParks(selectedOption));
        }catch{
            console.log("error")
        }
    //     console.log(parksFiltered["data"]);
      
        // console.log(parksFiltered.length)
        // send selectedOption to API
    }
    return (

        <div className='activities-list'>
            <div className="activity-dropdown">
                <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    className="basic-multi-select"
                    classNamePrefix="select"
                    options={activities}
                    onChange={choice => setSelectedOption(choice)}
                />


                <button className="searchButton" onClick={sendToAPI}>Search</button>

            </div>
            <br></br>
            <div className="search-button-wrapper" >
                <div className="search-button-grid" >
                    <Link className="search-button" to="/"><button className="search-button">Return To Home</button></Link>
                    <Link className="search-button" to="/"><button className="search-button" >Plan A Trip</button></Link>
                </div>
            </div>
        </div>
    );
}

export default ActivitiesList;
