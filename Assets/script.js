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

var API_KEY = "1ee679158fc39ec6485ef9e91e4c5172";

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
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      API_KEY +
      "&units=metric";

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
                var forecastUrl =
                  "https://api.openweathermap.org/data/2.5/onecall?lat=" + coord.lat + "&lon=" + coord.lon + "&exclude=current,minutely,hourly,alerts&appid=" + API_KEY + "&units=metric";
                    fetch(forecastUrl)
                        .then(function(response) {
                            if (response.ok) {
                                return response.json();
                            } else {
                                alert('Error: ' + response.statusText);
                            }
                        })
                        .then(function(data) {
                            displayForecast(data.daily);
                        });
            });
}
function displayCurrentWeather(data) {
    currentCity.textContent = data.name + ", " + new Date().toLocaleDateString();
    weatherIcon.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
    currentTemperature.textContent = "Temperature: " + data.main.temp + "°C";
    currentHumidity.textContent = "Humidity: " + data.main.humidity + "%";
    currentWindSpeed.textContent = "Wind Speed: " + data.wind.speed + " km/h";
}

function displayForecast(dailyData) {
    while (forecastCarousel.firstChild) {
        forecastCarousel.removeChild(forecastCarousel.firstChild);
    }
    for (var i = 0; i < 5; i++) {
        var dailyData = dailyData[i];
        
         var carouselItem = document.createElement("div");
         carouselItem.classList.add("carousel-item");
         if (i === 0) {
           carouselItem.classList.add("active");
         }

         var card = document.createElement("div");
         card.classList.add("card");

         var cardBody = document.createElement("div");
         cardBody.classList.add("card-body");

         var cardTitle = document.createElement("h5");
         cardTitle.classList.add("card-title");
         cardTitle.textContent = new Date(
           dayData.dt * 1000
         ).toLocaleDateString();

         var weatherImg = document.createElement("img");
         weatherImg.src =
           "https://openweathermap.org/img/wn/" +
           dayData.weather[0].icon +
           ".png";

         var tempText = document.createElement("p");
         tempText.classList.add("card-text");
         tempText.textContent = "Temperature: " + dayData.temp.day + "°C";

         var windText = document.createElement("p");
         windText.classList.add("card-text");
         windText.textContent = "Wind Speed: " + dayData.wind_speed + " km/h";

         var humidityText = document.createElement("p");
         humidityText.classList.add("card-text");
         humidityText.textContent = "Humidity: " + dayData.humidity + "%";

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(weatherImg);
        cardBody.appendChild(windText);
        cardBody.appendChild(tempText);
        cardBody.appendChild(humidityText);

        card.appendChild(cardBody);
        carouselItem.appendChild(card);
        forecastCarousel.appendChild(carouselItem);
    }
}

function addToSearchHistory(city) {
    var cityBtn = document.createElement('button');
    cityBtn.classList.add('btn', 'btn-light', 'mb-2', 'w-100');
    cityBtn.textContent = city;
    cityBtn.addEventListener('click' , function() {
        getWeatherData(city);
    });
    searchHistory.appendChild(cityBtn);
}