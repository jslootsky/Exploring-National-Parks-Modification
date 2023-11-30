// ParkInfo.js, fetch the list of parks and return info
export const ParkInfo = async (parkCode) => {
    try {
      await parkCode;
      var url = 'https://developer.nps.gov/api/v1/parks?api_key=0ilOFP8jTC2LMrwXFTullFqvHyVhBh9aHVW3OWEb&parkCode=' + parkCode;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

// parkVideos function that takes in parkCode and returns a list of videos
async function parkVideos(parkCode){
  try{
    var url =`https://developer.nps.gov/api/v1/multimedia/videos?parkCode=${parkCode}&api_key=Y7kFnm6SP5SMQhkTvwUSgyjge9buj4DbjrkuV2S0`;
    const response = await fetch(url);
    if(!response.ok){
      throw new Error('Unable to fetch videos');
    }
    const data = await response.json();
    console.log('videos: ', data);
  } catch(error){
    console.log('Error Fetching Videos: ', error.message);
  }
}
export default parkVideos;
  