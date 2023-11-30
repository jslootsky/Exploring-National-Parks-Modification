import React from 'react'
import { useEffect,useState } from 'react';   
import FetchAlerts from '../Functions/FetchAlerts';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const json = await FetchAlerts("havo");
                console.log(json);
                setAlerts(json.data);
            } catch (error) {
                // Handle the error, if needed
                console.log(error);

            }
        };

        fetchData();
    }, []);
    return (
        <div>
                <h1>Alerts</h1>
               
                        <div>{alerts.map((alert, index) => (
                            <p key={index}>{alert.title}</p>
                        ))}</div>
               
        </div>
    )
}

export default Alerts