import { all } from "q";

export const FetchThingsToDo = async (parkCode, activities, dates) => {
    try {
        console.log("parkCode2", parkCode.value);
        console.log("activities2", activities);
        console.log("dates2", dates);

        //Used to save the ids of the things to do returned and all of the things to do returned
        const allThingsToDo = [];
        const responseIds = new Set();
        var json;

        if(activities.length > 0) {
            for (const activity of activities) {
                const url =  `https://developer.nps.gov/api/v1/thingstodo?parkCode=${parkCode.value}&limit=3&q=${activity.label}&sort=-relevanceScore&api_key=0ilOFP8jTC2LMrwXFTullFqvHyVhBh9aHVW3OWEb`;
                console.log("url :" + url);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                json = await response.json();
                json.data.forEach(thing => {
                    console.log("thing",thing);
                    if(!responseIds.has(thing.id)) {
                        responseIds.add(thing.id);
                        allThingsToDo.push(thing);
                    }
                });
            }
            //Sort based on relevance score
            allThingsToDo.sort((a, b) => b.relevanceScore - a.relevanceScore);
        } else {
            const url =  `https://developer.nps.gov/api/v1/thingstodo?parkCode=${parkCode.value}&limit=50&api_key=0ilOFP8jTC2LMrwXFTullFqvHyVhBh9aHVW3OWEb`;
            console.log("url :" + url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            json = await response.json();
            json.data.forEach(thing => {
                console.log("thing",thing);
                allThingsToDo.push(thing);
            });
        }
        
        console.log("list", allThingsToDo);        
      return allThingsToDo;
    } catch (error) {
      console.error(error.message);
    }
  };

  export default FetchThingsToDo;