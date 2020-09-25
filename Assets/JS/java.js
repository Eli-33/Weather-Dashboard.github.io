 $(document).ready(function(){

  const inputEl = document.getElementById("city-input");
  const searchEl = document.getElementById("find-city");
  const clearEl = document.getElementById("clear-history");
  const nameEl = document.getElementById("city-name");
  const currentTempEl = document.getElementById("temperature");
  const currentHumidityEl = document.getElementById("humidity");
  const currentWindEl = document.getElementById("wind-speed");
  const currentUVEl = document.getElementById("UV-index");
  const historyEl = document.getElementById("history");
  let searchHistory = JSON.parse(localStorage.getItem("search"));
  console.log(searchHistory);
 // This is my API key
 var APIKey = "5252adc7b7a13b3bf6ea040224b54242"

 function getWeather(cityName) {
  //  Using saved city name, execute a current condition get request from open weather map api
          let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
          axios.get(queryURL)
          .then(function(response){
              console.log(response);
  //  Parse response to display current conditions
          //  Method for using "date" objects obtained from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
              const currentDate = new Date(response.data.dt*1000);
              console.log(currentDate);
              const day = currentDate.getDate();
              const month = currentDate.getMonth() + 1;
              const year = currentDate.getFullYear();
              nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
              var tempF = (response.data.main.temp - 273.15) * 1.80 + 32; 
               $("#temperature").text("Temperature:" + tempF.toFixed(2)+"F");
               $("#humidity").text("Humidity: " +  response.data.main.humidity+ "%");
               $("#wind-speed").text("Wind Speed: " + response.data.wind.speed +"MPH");
              
       
          let lat = response.data.coord.lat;
          let lon = response.data.coord.lon;
          let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
          axios.get(UVQueryURL)
          .then(function(response){
              let UVIndex = document.createElement("span");
              UVIndex.setAttribute("class","badge badge-danger");
              UVIndex.innerHTML = response.data[0].value;
              currentUVEl.innerHTML = "UV Index: ";
              currentUVEl.append(UVIndex);
          });
  //  Using saved city name, execute a 5-day forecast 
          let cityID = response.data.id;
          let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
          axios.get(forecastQueryURL)
          .then(function(response){
  //  Parse response to display forecast for next 5 days
              console.log(response);
              const forecastEls = document.querySelectorAll(".forecast");
              for (i=0; i<forecastEls.length; i++) {
                  forecastEls[i].innerHTML = "";
                  const forecastIndex = i*8 + 4;
                  const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                  const forecastDay = forecastDate.getDate();
                  const forecastMonth = forecastDate.getMonth() + 1;
                  const forecastYear = forecastDate.getFullYear();
                  const forecastDateEl = document.createElement("p");
                  forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
                  forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                  forecastEls[i].append(forecastDateEl);
                  const forecastWeatherEl = document.createElement("img");
                  forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                  forecastWeatherEl.setAttribute("alt",response.data.list[forecastIndex].weather[0].description);
                  forecastEls[i].append(forecastWeatherEl);

                  const forecastTempEl = document.createElement("p");
                  var tempF = (response.data.list[forecastIndex].main.temp- 273.15) * 1.80 + 32; 
                  forecastTempEl.innerHTML = "Temperature:" + tempF.toFixed(2)+"F";
                  forecastEls[i].append(forecastTempEl);
                  
                  const forecastHumidityEl = document.createElement("p");
                  forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                  forecastEls[i].append(forecastHumidityEl);
                  }
              })
          });  
      }
  

      searchEl.addEventListener("click",function() {
        const searchTerm = inputEl.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search",JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    clearEl.addEventListener("click",function() {
        searchHistory = [];
        renderSearchHistory();
    })

    function renderSearchHistory() {
      historyEl.innerHTML = "";
      for (let i=0; i<searchHistory.length; i++) {
          const historyItem = document.createElement("input");
          historyItem.setAttribute("type","text");
          historyItem.setAttribute("readonly",true);
          historyItem.setAttribute("class", "form-control d-block bg-white");
          historyItem.setAttribute("value", searchHistory[i]);
          historyItem.addEventListener("click",function() {
              getWeather(historyItem.value);
          })
          historyEl.append(historyItem);
      }
  }

  renderSearchHistory();
  if (searchHistory.length > 0) {
      getWeather(searchHistory[searchHistory.length - 1]);
  }
  });
