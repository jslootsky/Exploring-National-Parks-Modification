export const FetchForecast = async (parkCode) => {
    // get lat and long from zip code to use for forecast api
    // const getLatLong = async (zipCode) => {
    //    try{
    //         const url = `https://geocode.maps.co/search?postalcode=${zipCode}&country=US`;
    //         const response = await fetch(url);
    //         if(!response.ok){
    //             throw new Error('Network response was not ok');
    //         }
    //         const json = await response.json();
    //         console.log("latLong: " + json[0].lat);
    //         // return an object with lat and long
    //         const latLong = {
    //             lat: parseFloat(json[0].lat).toFixed(6),
    //             long: parseFloat(json[0].lon).toFixed(6),
    //         }
    //         console.log(latLong);
    //         return latLong;
    //    }catch(error){
    //        console.error(error.message);
    //        throw error;
    //    }
    // }
    if(!parkCode){
       return;
    }
    try {
        // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        // const targetUrl = 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=4600+Silver+Hill+Rd%2C+Washington%2C+DC+20233&benchmark=2020&format=json';
        // const response = await fetch(proxyUrl + targetUrl);
       // const latLong = await getLatLong(19104); //waits for return value from getLatLong
    
        const url = `https://api.weather.gov/points/${parkCode.latitude},${parkCode.longitude}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const json = await response.json();
        console.log(json);
        const forecastUrl = json.properties.forecast;
        console.log(forecastUrl);
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const forecastJson = await forecastResponse.json();
        console.log(forecastJson);
        //go to properties.periods and get for each day that is within the date range.
        let forecasts = {
        };
        // for each each period whose name does not contain "night" not case sensitive, add to forecasts
        forecastJson.properties.periods.forEach(period => {
            if (!period.name.toLowerCase().includes("night")) {
                forecasts[period.name] = period;
            }
        });
        console.log(forecasts);
        
        return forecasts;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}