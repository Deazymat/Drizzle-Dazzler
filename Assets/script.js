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
        addToSearchHistory(city);
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
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            return fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY + "&units=metric");
        })
        .then(response => response.json())
        .then(data => {
            displayForecast(data.list);
        })
        .catch(err => console.error("Error fetching data:", err));
}

function displayCurrentWeather(data) {
    var tempFahrenheit = (data.main.temp * 9) / 5 + 32;
    currentCity.textContent = data.name + ", " + new Date().toLocaleDateString();
    weatherIcon.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
    currentTemperature.textContent = "Temperature: " + tempFahrenheit.toFixed(1) + "°F";
    currentHumidity.textContent = "Humidity: " + data.main.humidity + "%";
    currentWindSpeed.textContent = "Wind Speed: " + data.wind.speed + " km/h";
}

function displayForecast(forecastData) {
   document.getElementById("forecastContainer").innerHTML = "";

  for (var i = 0; i < 5; i++) {
    var dayData = forecastData[i];

    var card = document.createElement("div");
    card.classList.add("card", "col-md-2", "ml-3");
    
    var card = document.createElement("div");
    card.classList.add("card");

    var cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    var cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = new Date(dayData.dt * 1000).toLocaleDateString();

    var weatherImg = document.createElement("img");
    weatherImg.src =
      "https://openweathermap.org/img/wn/" + dayData.weather[0].icon + ".png";

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