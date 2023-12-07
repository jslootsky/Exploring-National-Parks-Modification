import React, { useEffect } from 'react'
import { useState } from 'react'
import { FetchForecast } from '../Functions/FetchForecast';
const Schedule = ({ dates, parkCode }) => {
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [datesArray, setDatesArray] = useState([]);
    const [relevantTimeForecast, setRelevantTimeForecast] = useState([]);
    useEffect(() => {
        const fetchForecastData = async () => {
            try {
                const forecasts = await FetchForecast(parkCode);
                const relevantForecasts = [];
                for (let day in forecasts) {
                    let startTime = new Date(forecasts[day].startTime);
                    startTime.setHours(0, 0, 0, 0);
                    let start = new Date(startDate);
                    let end = new Date(endDate);

                    if (startTime >= start && startTime <= end) {
                        relevantForecasts.push({
                            startTime: startTime.toLocaleDateString(),
                            icon: forecasts[day].icon,
                            shortForecast: forecasts[day].shortForecast,
                        });
                    }
                }
                setRelevantTimeForecast(relevantForecasts);
                console.log(relevantTimeForecast);
            } catch (error) {
                console.log(error);
            }
        }
        if (dates !== null) {
            try {


                setStartDate(dates[0].toLocaleDateString());
                if (dates[1]) {
                    setEndDate(dates[1].toLocaleDateString());
                } else {
                    setEndDate(startDate);
                }

                // Convert startDate and endDate to Date objects
                const start = new Date(startDate);
                const end = new Date(endDate);

                // Create an array of dates between start and end
                const dateArray = [];
                while (start <= end) {
                    dateArray.push(new Date(start));
                    start.setDate(start.getDate() + 1);
                }

                // Now dateArray contains all the dates between startDate and endDate
                //console.log(dateArray);
                setDatesArray(dateArray);
                fetchForecastData();


            } catch (error) {
            }

        }

    }, [dates, startDate, endDate, parkCode]);



    if (dates === null) {
        return null;
    }
    if (parkCode === null) {
        return null;
    }

    return (
        <div>
            <div>
                {datesArray && datesArray.length > 0 ? <h1>Schedule</h1> : null}
            </div>
            <div className='dates-container'>
                {datesArray.map((date, index) => (
                    <div key={index} className='individual-date-container'>
                        <h3>{date.toLocaleDateString()}</h3>

                        {/* <img className='weather-image' src={relevantTimeForecast[index]?.icon} style={{ width: '50px', height: '50px' }}></img> */}

                        {relevantTimeForecast[index]?.startTime === date.toLocaleDateString() ? (
                            <div className='weather'>
                                <img
                                    className="weather-image"
                                    src={relevantTimeForecast[index]?.icon}
                                    style={{ width: '50px', height: '50px' }}
                                ></img>
                                <p>{relevantTimeForecast[index]?.shortForecast}</p>
                            </div>
                        ) : null}


                        <h3>Morning</h3>
                        <h3>Afternoon</h3>
                        <h3>Evening</h3>
                        <br />
                    </div>

                ))
                }
            </div >
        </div >
    )
}
export default Schedule
