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
            <div className='park-info'>
                    {parkJSON?.map((park) => (
                        <>
                        <div key={park.id} className="parkInfo" style={{ backgroundImage: 'url(' + park.images[0].url + ')', backgroundSize: 'auto' }}>
                            <div className='park-info-welcome'>
                                <center>
                                    <h1 id="info-title">{park.fullName}</h1>
                                    <h2>Park Information</h2>
                                    <address>{park.addresses[0].line1}<br></br>
                                        {park.addresses[0].city}, 
                                        {park.addresses[0].stateCode}<br></br>
                                    </address>
                                    <br></br>
                                </center>
                            </div>

                            <br></br>

                            <center>
                                <div className='box-1'>
                                    <div className='hours'>
                                        <ParkVideos parkCode={park.parkCode} />
                                    </div>
                                    <div className='hours'>
                                        <h1>Hours:</h1>
                                        <ul>
                                            <li>Monday:    {park.operatingHours[0].standardHours.monday}</li>
                                            <li>Tuesday:   {park.operatingHours[0].standardHours.tuesday}</li>
                                            <li>Wednesday: {park.operatingHours[0].standardHours.wednesday}</li>
                                            <li>Thursday:  {park.operatingHours[0].standardHours.thursday}</li>
                                            <li>Friday:    {park.operatingHours[0].standardHours.friday}</li>
                                            <li>Saturday:  {park.operatingHours[0].standardHours.saturday}</li>
                                            <li>Sunday:    {park.operatingHours[0].standardHours.sunday}</li>
                                        </ul>
                                        <br></br>
                                        <p>{park.description}</p>
                                        <a href={park.url} target="_blank" rel="noreferrer">For More Information</a>
                                    </div>
                                </div>
                            </center>

                            <br></br>

                            
                            
                            <h3>Activities</h3>
                            <div>
                                <ul>
                                {park.activities?.map((activity) =>(<>
                                <li key={activity.id}>{activity.name}</li></>))}</ul>
                            </div>

                            
                            <a href='./ParkInfo'><button>Return To Parks</button></a>
                            <button>Plan A Trip</button>
                        </div>
                        </>
                    ))}
            </div>
        );
    }
}

export default ParkInfoComponent;
