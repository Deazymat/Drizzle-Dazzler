// https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

// Parameters
// lat	required	Latitude, decimal (-90; 90). If you need the geocoder to automatic convert city names and zip-codes to geo coordinates and the other way around, please use our Geocoding API
// lon	required	Longitude, decimal (-180; 180). If you need the geocoder to automatic convert city names and zip-codes to geo coordinates and the other way around, please use our Geocoding API
// appid	required	Your unique API key (you can always find it on your account page under the "API key" tab)
// exclude	optional	By using this parameter you can exclude some parts of the weather data from the API response. It should be a comma-delimited list (without spaces).
// Available values:

// current
// minutely
// hourly
// daily
// alerts
// units	optional	Units of measurement. standard, metric and imperial units are available. If you do not use the units parameter, standard units will be applied by default. Learn more
// lang	optional	You can use the lang parameter to get the output in your language. Learn more

var cityInput = document.getElementById("cityInput");
var searchBtn = document.getElementById("searchBtn");
var searchHistory = document.getElementById("searchHistory");
var currentCity = document.getElementById("currentCity");
var weatherIcon = document.getElementById("weatherIcon");
var currentTemperature = document.getElementById("currentTemperature");
var currentHumidity = document.getElementById("currentHumidity");
var currentWindSpeed = document.getElementById("currentWindSpeed");
var forecastCarousel = document.getElementById("forecastCarousel");

var API_KEY = "9f9bbfacd8f14f3564f2ff92cd8a15bf";

searchBtn.addEventListener('click' , function() {
    var city =cityInput.value;
    if (city) {
        getWeatherData(city);
    }else {
        alert('Enter a City Name');
    }
});
function getWeatherData(city) {
    var apiURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" + city + "appid=" + API_KEY + "&units=metric";
        fetch(apiURL)
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                } else {
                    alert('Error: ' + response.statusText);
                }
            })
            .then(function(data) {
                displayCurrentWeather(data);
                return data.coord;
            })
            .then(function(coord) {
                var forcastUrl =
                  "https://api.openweathermap.org/data/2.5/onecall?lat=" + coord.lat + "&lon=" + coord.lon + "&exclude=current,minutely,hourly,alerts&appid=" + API_KEY + "&units=metric";
                    fetch(forcastUrl)
                        .then(function(response) {
                            if (response.ok) {
                                return response.json();
                            } else {
                                alert('Error: ' + response.statusText);
                            }
                        })
                        .then(function(data) {
                            displayForcast(data.daily);
                        });
            });




}


