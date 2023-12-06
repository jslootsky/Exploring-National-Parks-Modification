export const FetchForecast = async (zipCode) => {

    const getLatLong = async (zipCode) => {
       try{
            const url = `https://geocode.maps.co/search?postalcode=${zipCode}&country=US`;
            const response = await fetch(url);
            if(!response.ok){
                throw new Error('Network response was not ok');
            }
            const json = await response.json();
            console.log("latLong: " + json[0].lat);
            // return an object with lat and long
            const latLong = {
                lat: parseFloat(json[0].lat).toFixed(4),
                long: parseFloat(json[0].lon).toFixed(4),
            }
            console.log(latLong);
            return latLong;
       }catch(error){
           console.error(error.message);
           throw error;
       }
    }
    try {
        // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        // const targetUrl = 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=4600+Silver+Hill+Rd%2C+Washington%2C+DC+20233&benchmark=2020&format=json';
        // const response = await fetch(proxyUrl + targetUrl);
        const latLong = getLatLong(19104);
       
        const url = 'https://api.weather.gov/points/39.7456,-97.0892';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}