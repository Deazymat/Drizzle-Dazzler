var cityInput = document.getElementById("cityInput");
var searchBtn = document.getElementById("searchBtn");
var searchHistory = document.getElementById("searchHistory");
var currentCity = document.getElementById("currentCity");
var weatherIcon = document.getElementById("weatherIcon");
var currentTemperature = document.getElementById("currentTemperature");
var currentHumidity = document.getElementById("currentHumidity");
var currentWindSpeed = document.getElementById("currentWindSpeed");

var southernTexasCitys = [
  { name: "Webster", lat: 29.5377, lon: -95.1183 },
  { name: "Lake Jackson", lat: 29.0338, lon: -95.4344 },
  { name: "Port Arthur", lat: 29.8849, lon: -93.9399 },
  { name: "Pasadena", lat: 29.6911, lon: -95.2091 },
  { name: "Nassau Bay", lat: 29.5419, lon: -95.0894 },
];


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
           console.log("Forecast Data:", data);
            displayForecast(data.list);
        })
        .catch(err => console.error("Error fetching data:", err));
       
}
function addTexasCityButtons() {
  var texasCityContainer = document.getElementById("southernTexasCities");
  texasCityContainer.innerHTML = "";
  
  southernTexasCitys.forEach(city => {
    var button = document.createElement('button');
    button.classList.add('btn', 'btn-secondary', 'btn-block', 'mb-1');
    button.textContent = city.name;
    button.onclick = function() {
      getWeatherDataByCoords(city.lat, city.lon);
    };
    texasCityContainer.appendChild(button);
  });
}

function getWeatherDataByCoords(lat, lon) {
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY + "&units=metric";
    
    fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        displayCurrentWeather(data);
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
  console.log("Forecast Data:", data);
   document.getElementById("forecastContainer").innerHTML = "";

  for (var i = 3; i < 40; i+=8) {
    var dayData = forecastData[i];
    var card = document.createElement("div");
    card.classList.add("card", "col-md-2", "ml-3");
    
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
    var tempFahrenheitInForecast = (dayData.temp.day * 9) / 5 + 32;
    tempText.textContent = "Temperature: " + tempFahrenheitInForecast.toFixed(1) + "°F";

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
    document.getElementById("forecastContainer").appendChild(card);
  }
}

function addToSearchHistory(city) {
  var listItem = document.createElement("button");
  listItem.classList.add("list-group-item", "list-group-item-action");
  listItem.textContent = city;
  listItem.addEventListener("click", function () {
    getWeatherData(city);
  });
  searchHistory.appendChild(listItem);

}
addTexasCityButtons();