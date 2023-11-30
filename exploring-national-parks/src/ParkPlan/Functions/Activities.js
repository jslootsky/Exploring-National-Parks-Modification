// Activities.js
export const Activities = async () => {
    try {
      const response = await fetch(
        'https://developer.nps.gov/api/v1/activities?api_key=0ilOFP8jTC2LMrwXFTullFqvHyVhBh9aHVW3OWEb'
      );
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
  