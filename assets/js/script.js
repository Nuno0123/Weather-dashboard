// API Key cc733cca9c27c80fae216f34f9353377
var currentCity = "";
var lastCity = "";

var getCurrentConditions = (event) => {
    let city = $("#search-city").val();
    currentCity = $("search-city").val();
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=cc733cca9c27c80fae216f34f9353377";
    fetch(queryURL)
    .then((response) => {
        return response.json();
    })
    .then((response) => {
        saveCity(city);

        let currentWeather="https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        let currentTimeUTC = response.dt;
        let currentTimeZoneOffset = response.timezone;
        let currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
        let currentMoment = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);
        renderCities();
        getFiveDayForecast(event);
        $("#header-text").text(response.name);
        let currentWeatherHTML = `
            <h3>${response.name} ${currentMoment.format("(MM/DD/YY)")}<img src="${currentWeather}"></h3>
            <ul class="list-unstyled">
                <li>Temperature: ${response.main.temp}&#8457;</li>
                <li>Humidity: ${response.main.humidity}%</li>
                <li>Wind Speed: ${response.wind.speed} mph</li>
                <li id="uvIndex">UV Index:</li>
            </ul>`;
        $("#current-weather").html(currentWeatherHTML);
        let latitude = response.coord.lat;
        let longitude = response.coordlon;
        let uvQueryURL = "api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&APPID=cc733cca9c27c80fae216f34f9353377"
        uvQueryURL = "https://cors-anywhere.herokuapp.com/" + uvQueryURL;
        fetch(uvQueryURL)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            let uvIndex = response.value;
            $("#uvIndex").html(`UV Index: <span id="uvVal"> ${uvIndex}</span>`);
            if (uvIndex>=0 && uvIndex<3){
                $("#uvVal").attr("class", "uv-favorable");
            } else if (uvIndex>=3 && uvIndex<8){
                $("#uvVal").attr("class", "uv-moderate");
            } else if (uvIndex>=8){
                $("uvVal").attr("class", "uv-severe");
            }
        });
    })
}

var getFiveDayForecast = (event) => {
    let city = $("search-city").val();
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=cc733cca9c27c80fae216f34f9353377"
    fetch(queryURL)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            let fiveDayForecastHTML = `
            <h2>5-Day Forecast:</h2>
            <div id="fiveDayForecastUl" class="d-inline-flex flex-wrap ">`;
            for (let i = 0; i < response.list.length; i++) {
                let dayData = response.list[i];
                let dayTimeUTC = dayData.dt;
                let currentTimeZoneOffset = response.city.timezone;
                let currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
                let thisMoment = moment.unix(dayTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);
                let iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
                if (thisMoment.format("HH:mm:ss") === "11:00:00" || thisMoment.format("HH:mm:ss") === "12:00:00" || thisMoment.format("HH:mm:ss") === "13:00:00") {
                    fiveDayForecastHTML += `
                    <div class="weather-card card m-2 p0">
                    <ul class="list-unstyled p-3">
                        <li>${thisMoment.format("MM/DD/YY")}</li>
                        <li class="weather-icon"><img src="${iconURL}"></li>
                        <li>Temp: ${dayData.main.temp}&#8457;</li>
                        <br>
                        <li>Humidity: ${dayData.main.humidity}%</li>
                    </ul>
                </div>`;
                }
            }
            fiveDayForecastHTML += `</div>`;
            $("#five-day-forecast").html(fiveDayForecastHTML)
        })
}

var saveCity = (newCity) => {
    let cityExists = false;
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage["cities" + i] === newCity) {
            cityExists = true;
            break; 
        }
    }
    if (cityExists === false) {
        localStorage.setItem("cites" + localStorage.length, newCity);
    }
}

var renderCities = () => {
    $("#city-results").empty();
    if (localStorage.length===0){
        if (lastCity){
            $("#search-city").attr("value", lastCity);
        } else {
            $("search-city").attr("value", "Austin");
        }
    } else {
        let lastCityKey="cities"+(localStorage.length-1);
        lastCity=localStorage.getItem(lastCityKey);
        $("#search-city").attr("value", lastCity);
        for (let i = 0; i < localStorage.length; i++) {
            let city = localStorage.getItem("cities" + i);
            let cityEl
            if (currentCity===""){
                currentCity=lastCity;
            }
            if (city === currentCity) {
                cityEl = `<button type="button" class="list-group-item list-group-item-action active">${city}</button></li>`;
            } else {
                cityEl = `<button type="button" class="list-group-item list-group-item-action">${city}</button></li>`;
            }
            $("#city-results").prepend(cityEl);
        }
        if (localStorage.legnth>0){
            $("#clear-storage").html($('<a id="clear-storage" href="#">clear</a>'));
        } else {
            $("#clear-storage").html('');
        }
    }
}

$("#search-button").on("click", (event)=> {
    event.preventDefault();
    currentCity = $("#search-city").val();
    getCurrentConditions(event);
});

$("#clear-stroage").on("click", (event) => {
    localStorage.clear();
    renderCities();
});

renderCities();

getCurrentConditions();



