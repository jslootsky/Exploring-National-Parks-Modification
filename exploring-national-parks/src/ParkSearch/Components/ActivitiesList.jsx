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
    const activities = posts?.map((post) => { return { value: post.id, label: post.name } });
    const animatedComponents = makeAnimated()
    const [selectedOption, setSelectedOption] = useState([]);
    const [parksFiltered, setParksFiltered] = useState(null);
    
    const sendToAPI = async () => {
        // console.log("selected option below");
        //console.log(selectedOption);
        try{
            const filtered = await FetchParks(selectedOption);
            setParksFiltered(filtered.data);
        }catch{
            console.log("error")
        }
        //console.log(parksFiltered["data"]);
      
        // console.log(parksFiltered.length)
        // send selectedOption to API
    }
    console.log(parksFiltered);
    //console.log("parks filtered above");
    
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


                <button className="activity-search-button" onClick={sendToAPI}>Search</button>

            </div>
            <br></br>
            <br></br>
            <div className="search-button-wrapper" >
                <div className="search-button-grid" >
                    <Link className="search-button" to="/"><button className="search-button">Return To Home</button></Link>
                    <Link className="search-button" to="/"><button className="search-button" >Plan A Trip</button></Link>
                </div>
            </div>


            <div className="parks">

                {parksFiltered?.map((park) => (
                    <div key={park.id} className="post-card">
                        <div>
                            <div className="learn-more-dropdown">
                                <div className="learn-more-name">
                                    <p>{park.fullName}</p>
                            </div>
                                <div className="learn-more-option">
                                    <a href={'ParkInfo/#'+park.parkCode}><button className="learn-more-button">Learn More</button></a>
                                </div>
                            </div>
                            <img src={park.images[0].url} alt=''/>
                        </div>
                        <p>{park.description}</p>
                    </div>
                ))}
                    
            </div>

        </div>
    );
}

export default ActivitiesList;
