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

    return (
        <div className='parkInfo'>

            <center>
                <h1>Park Information</h1>
            </center>
            <br></br>
            <div className="parks">

                {parkJSON?.map((park) => (
                    
                    <div key={park.id} className="post-card">
                        <a href="#placeholder">{park.fullName}</a>
                    </div>
                ))}
                <button>Return To Home</button>
                <button>Plan A Trip</button>
            </div>
        </div>
    );
}

export default ParkInfoComponent;
