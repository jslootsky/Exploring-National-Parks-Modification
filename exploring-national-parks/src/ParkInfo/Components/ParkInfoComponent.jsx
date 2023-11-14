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
                            <a href={'/#'+park.parkCode}>{park.fullName}</a>
                        </div>
                    ))}
                    <button>Return To Home</button>
                    <button>Plan A Trip</button>
                </div>
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
                <div className="parkDetail">

                    {parkJSON?.map((park) => (
                        <h1 key={park.id}>{park.fullName}</h1>
                    ))}
                    <a href='./'><button>Return To Home</button></a>
                    <button>Plan A Trip</button>
                </div>
            </div>
        );
    }
}

export default ParkInfoComponent;
