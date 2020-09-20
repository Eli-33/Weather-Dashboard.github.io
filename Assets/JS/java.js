  $(document).ready(function(){

// This .on("click") function will trigger the AJAX Call
$("#find-city").on("click", function(event) {
    event.preventDefault();
    
    var city = $("#city-input").val();
    // This is my API key
    var APIKey = "5252adc7b7a13b3bf6ea040224b54242"
     // Here we are building the URL
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" +
      city +"&appid="+ APIKey;
      
      $.ajax({
        url: queryURL,
        method: "GET"
      })
      .then(function(response) {
        // $("#city-view").text(JSON.stringify(response));
        
      function renderButtons(){
           
        for (var i=0; i < city ; i++){
            var newCity=$("<div>");
            newCity.attr("data-name", city[i]);
            newCity.text(city[i]);
        }
      $("#city-view").append("<div class=new>" + response.name +"</div>");
     
      }
    
    renderButtons();

        var currentDay = moment().format('dddd') + ", " + moment().format('MMMM Do YYYY');

        $(".city").html("<h1>" + response.name +"</h1>"); 
        $("#currentDay").html("<h2>"+ currentDay +"<h2>"); 

        var tempF = (response.main.temp - 273.15) * 1.80 + 32; 
        $(".tempF").text("Temperature:" + tempF.toFixed(2)+"F");

        $(".humidity").text("Humidity: " + response.main.humidity+ "%");
        $(".wind").text("Wind Speed: " + response.wind.speed +"MPH");

        $(".UV").text("UV Index: " + response.main.uv);
        
      });

      var city = $("#city-input").val();
      // This is my API key
      var APIKey = "5252adc7b7a13b3bf6ea040224b54242"
       // Here we are building the URL
      var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" +
        city +"&appid="+ APIKey;
        
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response){
            console.log(response);

            for(var i=0; i<=4 ; i++){
                var newDay=$("<div>");
                var date=$("<div>");
                var Ntemp=$("<div>");
                var Nhumidity=$("<div>");

                date.text(response.list[i].dt_txt).appendTo(newDay);

                var tempF = (response.list[i].main.temp - 273.15) * 1.80 + 32; 
                $(".temp").text("Temperature:" + tempF.toFixed(2)+"F");
                Ntemp.text("temp:"+ tempF.toFixed(2)+"F").appendTo(newDay);
                
                Nhumidity.text("Humidity:" + response.list[i].main.humidity +"%").appendTo(newDay);

                newDay.appendTo("#forecasts");
            }
        });


 });


  });
