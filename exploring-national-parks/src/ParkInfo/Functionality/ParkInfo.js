// ParkInfo.js, fetch the list of parks and return info
export const ParkInfo = async (parkCode, page) => {
    try {
      await parkCode;
      await page;
      var url = 'https://developer.nps.gov/api/v1/parks?api_key=0ilOFP8jTC2LMrwXFTullFqvHyVhBh9aHVW3OWEb&parkCode=' + parkCode + '&start=' + page;
      console.log("url park info",url);
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

  