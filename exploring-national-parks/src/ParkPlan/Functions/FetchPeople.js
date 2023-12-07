export const FetchPeople = async (parkCode) => {
    try {
      const url =  `https://developer.nps.gov/api/v1/people?parkCode=${parkCode.value}&api_key=0ilOFP8jTC2LMrwXFTullFqvHyVhBh9aHVW3OWEb`;
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

export default FetchPeople;