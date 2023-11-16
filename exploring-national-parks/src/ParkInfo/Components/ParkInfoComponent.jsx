// ParkInfoComponent.jsx
import React, { useState, useEffect } from 'react';
import { ParkInfo } from '../Functionality/ParkInfo'; // Importing the functionality
import '../../Style/parkInfo.css';

function ParkInfoComponent() {
    const [parkJSON, setParks] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const parkCode = window.location.hash.substring(1); //hash value from selecting a park removing hash char
                const json = await ParkInfo(parkCode);
                console.log(json);
                setParks(json.data);
            } catch (error) {
                // Handle the error, if needed
            }
        };

        fetchData();
    }, []);

    if(parkJSON.length>1){ //list all the parks
        return (
            <div className='parkInfo'>

                <center>
                    <h1>Park Information</h1>
                </center>
                <br></br>
                <div className="parks">

                    {parkJSON?.map((park) => (
                        
                        <div key={park.id} className="post-card">
                            <a href={window.location+'/#'+park.parkCode}>{park.fullName}</a>
                        </div>
                    ))}
                    
                </div>
                <a href="./"><button>Return To Home</button></a>
                <button>Plan A Trip</button>
            </div>
        );
    }
    else{ //detail for one park
        return (
            <div className='parkInfo'>

                <center>
                    <h1>Park Information</h1>
                </center>
                <br></br>

                    {parkJSON?.map((park) => (
                        <div key={park.id} className="parkDetail">
                            <h1>{park.fullName}</h1>
                            <img src={park.images[0].url} alt=''/>
                            <p>{park.description}</p>
                            <address>{park.addresses[0].line1}<br></br>
                                {park.addresses[0].city}, 
                                {park.addresses[0].stateCode}<br></br>
                            </address>
                            <h3>Hours:</h3>
                            <div>
                                <h4>monday: {park.operatingHours[0].standardHours.monday}</h4>
                                <h4>tuesday: {park.operatingHours[0].standardHours.tuesday}</h4>
                                <h4>wednesday: {park.operatingHours[0].standardHours.wednesday}</h4>
                                <h4>thursday: {park.operatingHours[0].standardHours.thursday}</h4>
                                <h4>friday: {park.operatingHours[0].standardHours.friday}</h4>
                                <h4>saturday: {park.operatingHours[0].standardHours.saturday}</h4>
                                <h4>sunday: {park.operatingHours[0].standardHours.sunday}</h4>
                            </div>
                            <a href={park.url} target="_blank" rel="noreferrer">For More Information</a>
                        </div>
                    ))}
                    <a href='./'><button>Return To Parks</button></a>
                    <button>Plan A Trip</button>

            </div>
        );
    }
}

export default ParkInfoComponent;
