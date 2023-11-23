export const FetchParks = async (activityArray) => {
    try {
        const numActivities = activityArray.length;
        const values = activityArray.map(activity => activity.value);
        const valuesString = values.join(', ');
        const encodedValuesString = encodeURIComponent(valuesString);

        console.log("Values: " + encodedValuesString);
        
        const url =  `https://developer.nps.gov/api/v1/activities/parks?api_key=0ilOFP8jTC2LMrwXFTullFqvHyVhBh9aHVW3OWEb&id=&q=${encodedValuesString}`
        console.log("url :" + url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const json = await response.json();
        //console.log("json below");
        //console.log(json);

        const parkMap = new Map();
        const allActivitiesParks = [];

        json.data.forEach(activity => {
            //console.log(activity.parks)
            activity.parks.forEach(parkName => {
                if(parkMap.has(parkName.parkCode)) {
                    parkMap.set(parkName.parkCode,parkMap.get(parkName.parkCode) + 1);
                } else {
                    parkMap.set(parkName.parkCode,1);
                }
                //console.log(parkName.fullName);
                //console.log(parkName.parkCode);
            });
        });

        parkMap.forEach((value,key) => {
           if(value === numActivities) {
                allActivitiesParks.push(key);
           }
        });


        return allActivitiesParks;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export default FetchParks;