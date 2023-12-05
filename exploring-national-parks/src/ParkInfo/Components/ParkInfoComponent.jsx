// ParkInfoComponent.jsx
import React, { useState, useEffect } from 'react';
import { ParkInfo } from '../Functionality/ParkInfo'; // Importing the functionality
import '../../Style/parkInfo.css';
import ParkVideos from './ParkVideos';

function ParkInfoComponent() {
    const [parkJSON, setParks] = useState([]);
    
    var url = new URL(window.location);
    var page = 0;
    page = url.searchParams.get("page");
    if(page==null)
        page = 0;
    var pageUp = parseInt(page)+50;
    var pageDown = parseInt(page)-50;
    if(pageDown<0)
        pageDown = 0;

    const parkCode = url.searchParams.get("parkCode");
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                var json;

                //const parkCode = window.location.hash.substring(1); //hash value from selecting a park removing hash char
                if(parkCode == null)
                    json = await ParkInfo('', page);
                else
                    json = await ParkInfo(parkCode, 0);
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
                    <h1>Park Information Page</h1>
                </center>
                <br></br>
                <div className="parks">

                    {parkJSON?.map((park) => (
                        
                        <div key={park.id} className="post-card">
                            <a href={'./ParkInfo?parkCode='+park.parkCode}>{park.fullName}</a>
                        </div>
                    ))}
                    
                </div>
                <a href={'./ParkInfo?page='+pageDown}><button>Previous Page</button></a>
                <a href={'./ParkInfo?page='+pageUp}><button>Next Page</button></a>
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
                        <>
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
                            <h3>Activities</h3>
                            <div>
                                <ul>
                                {park.activities?.map((activity) =>(<>
                                <li key={activity.id}>{activity.name}</li></>))}</ul>
                            </div>

                            <a href={park.url} target="_blank" rel="noreferrer">For More Information</a>
                        </div>
                        <div>
                            <ParkVideos parkCode={park.parkCode} />
                        </div>
                        </>
                    ))}
                    <a href='./ParkInfo'><button>Return To Parks</button></a>
                    <button>Plan A Trip</button>

            </div>
        );
    }
}

export default ParkInfoComponent;
