// ParkInfo.js, fetch the list of parks and return info
export const ParkInfo = async (parkCode) => {
  try {
    const cachedData = localStorage.getItem(parkCode);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    var url = 'https://developer.nps.gov/api/v1/parks?api_key=0ilOFP8jTC2LMrwXFTullFqvHyVhBh9aHVW3OWEb&parkCode=' + parkCode;
    console.log("url park info",url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const json = await response.json();

    // Cache the response to localStorage
    localStorage.setItem(parkCode, JSON.stringify(json));

    return json;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
