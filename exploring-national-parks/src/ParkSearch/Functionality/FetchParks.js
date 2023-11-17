export const FetchParks = async (activityArray) => {
    try {
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
        console.log("json below");
        console.log(json);
        return json;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};