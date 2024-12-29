const api_key = open_weather_api_key; //Open Weather API Key

const latlong_URL = `https://api.openweathermap.org/geo/1.0/direct?q={city name}&limit=1&appid=${api_key}`; //URL to get latitude and longitude of a city

//Getting HTML Elements
const searchButton = document.querySelector("#searchButton");
const city = document.querySelector("#city-name-output");
const Temp = document.querySelector("#temp-output");
const humidity = document.querySelector("#humidity-output");
const weatherIcon = document.querySelector("#weather-icon");
const weather = document.querySelector("#weather-output");
const backgroundVideo = document.querySelector("#background-video");
const weatherFields = document.querySelector(".weather-fields");
const feelsLike = document.querySelector("#feels-like");

//Event Listener for search button
searchButton.addEventListener("click", async (event) => {
    event.preventDefault(); //Prevent the default form submission
    const cityNameInput = document.querySelector("#cityName"); //Getting the city name input field
    const cityName = cityNameInput.value.trim(); //Extracting the city name and removing any leading or trailing whitespaces
    if(cityName === "") { //Checking if the city name is empty
        alert("Please enter a city name"); 
        return; 
    }
    try { 
        //Fetching the latitude and longitude of the city
        const geo_response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`);

        //Parsing the response
        const geo_coding = await geo_response.json();

        if(geo_coding.length === 0) { //Checking if the city is not found
            alert("City not found");
            return;
        }

        //Extracting latitude and longitude from the response
        const { lat , lon } = geo_coding[0]; 

        //Fetching the weather data using the latitude and longitude
        const weather_response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat.toFixed(2)}&lon=${lon.toFixed(2)}&appid=${api_key}`);

        //Parsing the response
        const weather_data = await weather_response.json();

        //Updating the HTML elements with the weather data
        city.innerText = cityName; //Setting the city name
        Temp.innerText = (weather_data.main.temp - 273).toFixed(1); //Setting the maximum temperature
        humidity.innerText = weather_data.weather[0].description; //Setting the humidity
        weather.innerText = weather_data.weather[0].main; //Setting the weather description

        console.log(weather_data);
        feelsLike.innerText = "Feels like " + (weather_data.main.feels_like - 273).toFixed(1) + " °C";

        const iconCode = weather_data.weather[0].icon;
        const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        weatherIcon.src = iconURL;

        //Setting the background video based on the weather
        if(weather_data.weather[0].main === "Rain"){
            backgroundVideo.src = "Rain.mp4";
        } else if(weather_data.weather[0].main === "Snow"){
            backgroundVideo.src = "Snow.mp4";
        } else if(weather_data.weather[0].main === "Clear"){
            backgroundVideo.src = "Clear.mp4";
        } else if(weather_data.weather[0].main === "Clouds"){
            backgroundVideo.src = "Cloudy.mp4";
        } else if(weather_data.weather[0].main === "Haze"){
            backgroundVideo.src = "Haze.mp4";
        } else if(weather_data.weather[0].main === "Fog" || weather_data.weather[0].main === "Smoke") {
            backgroundVideo.src = "Fog.mp4";
        } else {
            backgroundVideo.src = "default.mp4";
        }

        //Displaying the weather fields
        weatherFields.style.display = "Block";

    } catch (error) { //Handling errors
        console.error("Error fetching weather data:", error);
        alert("An error occurred while fetching the weather data. Please try again.");
    }

});