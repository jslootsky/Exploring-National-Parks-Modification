export const FetchAlerts = async (parkCode) =>{
    try{
        const url = `https://developer.nps.gov/api/v1/alerts?api_key=0ilOFP8jTC2LMrwXFTullFqvHyVhBh9aHVW3OWEb&parkCode=${parkCode}&q=closure`;
        const response = await fetch(url);
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        const json = await response.json();
        // json.data.map((alert => {return alert.id, alert.description}))
        return json;
    }catch (error){
        console.error(error.message);
        throw error;
    }
}
export default FetchAlerts;
