import React, { useEffect } from 'react'
import { useState } from 'react'
import { act } from 'react-dom/test-utils';
import { FetchThingsToDo } from '../Functions/FetchThingsToDo';
const Schedule = ({ dates, parkCode, activities}) => {
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [datesArray, setDatesArray] = useState([]);
    const [thingsToDo, setThingsToDo] = useState();

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
                const activitiesToDo = await FetchThingsToDo(parkCode, activities, dates);
                setThingsToDo(activitiesToDo);
                console.log("things to do", thingsToDo);
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

    const ReturnSchedule = () => {
        var thingsIndex = 0;
        console.log("first thing index",thingsIndex);
        const morningActivities = [];
        const dayActivities = [];
        const eveningActivites = [];
        for(let i =0; i<datesArray.length; i++) {
            //Fill in morning array
            console.log("in foreach",datesArray[i]);
            morningActivities.push(thingsToDo && thingsToDo[thingsIndex]);
            console.log("in foreach 2",thingsToDo && thingsToDo[thingsIndex]);
            thingsIndex++;
            if(thingsIndex === thingsToDo?.length) {
                thingsIndex=0;
            }
            console.log("things index",thingsIndex);

            //Fill in day array
            console.log("in foreach",datesArray[i]);
            dayActivities.push(thingsToDo && thingsToDo[thingsIndex]);
            console.log("in foreach 2",thingsToDo && thingsToDo[thingsIndex]);
            thingsIndex++;
            if(thingsIndex === thingsToDo?.length) {
                thingsIndex=0;
            }
            console.log("things index",thingsIndex);

            //Fill in evening array
            console.log("in foreach",datesArray[i]);
            eveningActivites.push(thingsToDo && thingsToDo[thingsIndex]);
            console.log("in foreach 2",thingsToDo && thingsToDo[thingsIndex]);
            thingsIndex++;
            if(thingsIndex === thingsToDo?.length) {
                thingsIndex=0;
            }
            console.log("things index",thingsIndex);
        };
        return (datesArray.map((date, index) => (
            <div key={index} className='individual-date-container'>
                <h3>{date.toLocaleDateString()}</h3>
                <h3>Morning</h3>
                {morningActivities && morningActivities[index]?.title}
                {console.log(morningActivities)}
                <h3>Afternoon</h3>
                {dayActivities && dayActivities[index]?.title}
                {console.log(dayActivities)}
                <h3>Evening</h3>
                {eveningActivites && eveningActivites[index]?.title}
                {console.log(eveningActivites)}
                <br />
            </div>

        )));
    }

    return (
        <div>
            <div>
                {datesArray && datesArray.length > 0 ? <h1>Schedule</h1> : null}
            </div>
            <div className='dates-container'>
                <ReturnSchedule />
            </div>
        </div>
    )
}
export default Schedule
