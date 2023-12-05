import React, { useEffect } from 'react'
import { useState } from 'react'
import { act } from 'react-dom/test-utils';
import { FetchThingsToDo } from '../Functions/FetchThingsToDo';
const Schedule = ({ dates, parkCode, activities}) => {
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [datesArray, setDatesArray] = useState([]);

    useEffect(() => {
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
            } catch (error) {
            }
        }
    }, [dates, startDate, endDate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("parkCode", parkCode.value);
                console.log("activities", activities);
                console.log("dates", dates);
                const json = await FetchThingsToDo(parkCode, activities, dates);
                console.log(json);
            } catch (error) {
                // Handle the error, if needed
                console.log(error);
            }
        };

        if (parkCode !== null && dates !== null && activities !== null) {
            fetchData();
        }
    }, [parkCode,activities,dates]);

    if (dates === null || parkCode === null || activities === null) {
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
                        <h3>Morning</h3>
                        <h3>Afternoon</h3>
                        <h3>Evening</h3>
                        <br />
                    </div>

                ))}
            </div>
        </div>
    )
}
export default Schedule
