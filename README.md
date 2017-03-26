# Weather-Map
Free Code Camp Weather Application for Chrome browser, runs in codepen editor
<a href="https://codepen.io/joshpas4991/full/wgKQNP/">CodePen Project</a>
<strong>NOTE:</strong> Use https when trying to check the weather by clicking on <em> Get Local Weather</em> That lights up on hover.
Google Chrome geolocation API will not retrieve accurate coordinates UNLESS you are on a secure HTTPS connection.
<a href="https://www.freecodecamp.com/challenges/show-the-local-weather">Original FreeCodeCamp Challenge!</a>
<a href="http://www.apixu.com/doc/">Weather API Service that can make HTTPS API Queries</a>


### HTML Imports and Libraries
* Statements to add to the `<head></head>` tags in the HTML doc  
```html
<link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<meta name="viewport" content="width=device-width, initial-scale=1">
```
* Used common CSS icons from <a href="https://www.w3schools.com/w3css/" target="_blank">w3 Schools</a>
* Used Cloudfare's <a href="http://fontawesome.io/" target="_blank">font-awesome library</a>

### CSS Import Links
* When linking use <a href="https://blackrockdigital.github.io/startbootstrap-grayscale/vendor/font-awesome/css/font-awesome.min.css" target="_blank">this url</a> for <a target="_blank" href="https://github.com/BlackrockDigital/startbootstrap-grayscale">Black Rock Digital CSS Version of Font-awesome Library</a>
* Use <a target="_blank" href="https://blackrockdigital.github.io/startbootstrap-grayscale/css/grayscale.min.css">this url</a> for Black Rock Digital's grayscale theme.
* Use <a target="_blank" href="https://erikflowers.github.io/weather-icons/css/weather-icons.min.css"> this url</a>to import the <a target="_blank" href="https://startbootstrap.com/template-overviews/grayscale/">grayscale theme.</a>
* Used two CSS libraries from <a href="https://erikflowers.github.io/weather-icons/" target="_blank">Erik Flowers</a> development website.
  1. Use <a href="https://erikflowers.github.io/weather-icons/css/weather-icons.min.css" target="_blank">this url</a> for accessing the main weather icons CSS stylesheet.
  2. Use <a href="https://erikflowers.github.io/weather-icons/css/weather-icons-wind.min.css" target="_blank">this url</a> for accessing the wind icons.
* Used <a href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css" target="_blank">this url</a> to access <a href="http://getbootstrap.com/css/" target="_blank">Google BootStrap CSS Library</a>  
  
### Javascript Libraries
* The libraries for Bootstrap, grayscale, all came with their own javascript or Jquery libraries.
* Use <a href="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js" target="_blank">this url</a> to import regular jquery and <a href="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js" target="_blank">this url</a> to import Jquery easing.

## Api Commands
* <strong>Base API Url</strong>:
    ```javascript
    var api_base = "https://api.apixu.com/v1/forecast.json?key=$YOUR_API_KEY"; //Base API url
    //Once finished with free signup on the apixu website, use the API_KEY granted to your account in the
    //$YOUR_API_KEY field
    ```
* <strong>Obtaining the local coordinates on a web browser</strong>: 
  Browsers like chrome, provide the opportunity to let the browser learn the geographic coordinates of where the user is located, so the browser or websites or browser plugins and extensions can provide additional functionality. Knowing accurate up-to-date location information is <em>critical</em> for a weather application so it can provide relevant, custom forecasts for users all over the world. Google provides access this feature in javascript and jquery through using the <strong>geolocation</strong> function. 
  --<em>Note: to be able to use this feature the page must be loaded using the url prefix <strong>HTTPS</strong> as in `https://some-url.com`. Also API requests using this feature should be done over HTTPS as well that is why the OpenWeatherMap website FreeCodeCamp recommends cannot fully accurate coordinate based-locations since it makes its requests or HTTP</em>
* Getting geolocation information in Jquery:
  ```javascript
  // Coordinates in my program were only retrieved when users clicked on a button which would call an event-handler function below:
  var testCoords = function() {
    if (navigator.geolocation) { //First test if the browser is able to retrieve or use GPS functions
      navigator.geolocation.getCurrentPosition(function(position) { //'position' is the user's coordinates
        //If it can, have it retrieve the coordinates and GPS info and have it execute code below on that event
        initialLongitude = position.coords.longitude; //Retrieve the longitude and bind it to a variable
        initialLatitude = position.coords.latitude;  //Retrieve the latitude
        $(".lat-load").text(Math.abs(initialLatitude).toFixed(2)); 
        //Load a formatted string decimal to HTML elements with .lat-load class
        $(".longt-load").text(Math.abs(initialLongitude).toFixed(2)); //Load longitude to .longt-load HTML classes
        checkDir(initialLatitude, initialLongitude);
        getJSONS(initialLatitude, initialLongitude);
      });
    }
  };
  ```
* <strong>Use API URL and coordinates to make an HTTPS API request and retrieve the JSON response</strong>: the coordinates were stored in the javascript variables `var initialLat,initialLong`. From there the full query is formed and its response, a JSON object, is retrieved and stored, as that object has all the forecast information needed to make the app work. Code below, request made through AJAX:
   ```javascript
   //getJSONS was one of the functions called when the coordinates of the user need to be retrieved and loaded, this function provides
   //program with all the forecast data to load into the webpage from the JSON response from the apixu API
    var getJSONS = function(initialLat, initialLong) { //initialLat and long are the coordinates retrieved from geolocation
    var api_query = api_base + "&q=" + initialLat.toString() + "," + initialLong.toString();
  //Adds "&q=$LAT,$LONG to the API query 
    $("#json-link").attr({
      "href": api_query,
      "target": "_blank",
      "title": "Click here to see the JSON response in another tab"
    });
    //Make an AJAX request with the newly created api_query url, and if there is a successful response execute the function specified in
    // the success: function(response){} field below
    $.ajax({
      url: api_query,
      success: function(response) {
        var responseString = JSON.stringify(response); //Turn the HTTP response object into a string
        var baseObject = JSON.parse(responseString); // Convert the JSON string into a JSON object/dictionary that javascript can use
        $("#putJSON").text(baseObject.location.name); // All following statements are loading data into the correct HTML elements of the                                                       //webpage
        $("#load-json").text(baseObject.current.condition.text);
        var foreCast = baseObject.forecast.forecastday[0];
        var astro = baseObject.forecast.forecastday[0].astro;
        setLocation(baseObject.location.name, baseObject.location.region, baseObject.location.country);
        setTemperatures(baseObject.current.temp_f, foreCast.day.avgtemp_f, foreCast.day.mintemp_f, foreCast.day.maxtemp_f, baseObject.current.feelslike_f, baseObject.current.humidity, foreCast.day.condition.text, baseObject.current.is_day);
        loadWindwPrec(baseObject.current.wind_mph, baseObject.current.wind_dir, baseObject.current.wind_degree, baseObject.current.pressure_in, foreCast.day.totalprecip_in, foreCast.day.totalprecip_mm);
        loadTimes(astro.sunrise, astro.sunset, astro.moonrise, astro.moonset);
      }
    });
  };
  ```
* By default, when provided with just two coordinates, apixu will give a full, detailed forecast information in the area of the passed-in coordinates for up to 1 day. Forecasts for up to more days can be given but they must be specified by adding additional parameters to the HTTP query
* A link to a response JSON is<a href="https://api.apixu.com/v1/forecast.json?key=c5ea8f0d9cf54e4db0473007171201&q=33.682190399999996,-117.88660709999999" target="_blank">here</a>. A small snippet is below, the JSON response in full is quite long since the API provides data by the hour for one whole day.
```javascript
{"location":{"name":"Paularino","region":"California","country":"United States of 
America","lat":33.68,"lon":-117.89,"tz_id":"America/Los_Angeles","localtime_epoch":1490488406,"localtime":"2017-03-25 17:33"},"current":
{"last_updated_epoch":1490488406,"last_updated":"2017-03-25 17:33","temp_c":18.3,"temp_f":64.9,"is_day":1,"condition":{"text":"Partly 
cloudy","icon":"//cdn.apixu.com/weather/64x64/day/116.png","code":1003},"wind_mph":9.4,"wind_kph":15.1,"wind_degree":230,"wind_dir":"SW"
,"pressure_mb":1017.0,"pressure_in":30.5,"precip_mm":0.1,"precip_in":0.0,"humidity":70,"cloud":75,"feelslike_c":18.3,"feelslike_f":64.9,
"vis_km":16.0,"vis_miles":9.0},"forecast":{"forecastday":[{"date":"2017-03-25","date_epoch":1490400000,"day":
{"maxtemp_c":20.5,"maxtemp_f":68.9,"mintemp_c":12.0,"mintemp_f":53.6,"avgtemp_c":15.6,"avgtemp_f":60.1,"maxwind_mph":15.2,"maxwind_kph":
24.5,"totalprecip_mm":0.2,"totalprecip_in":0.01,"avgvis_km":18.9,"avgvis_miles":11.0,"avghumidity":79.0,"condition":
{"text":"Sunny","icon":"//cdn.apixu.com/weather/64x64/day/113.png","code":1000}},"astro":{"sunrise":"06:48 AM","sunset":"07:07 
PM","moonrise":"05:22 AM","moonset":"04:50 PM"},"hour":[{"time_epoch":1490425200,"time":"2017-03-25 
00:00","temp_c":12.7,"temp_f":54.9,"is_day":0,"condition":{"text":"Partly 
cloudy","icon":"//cdn.apixu.com/weather/64x64/night/116.png","code":1003},"wind_mph":2.2,"wind_kph":3.6,"wind_degree":251,"wind_dir":"WS
W","pressure_mb":1022.0,"pressure_in":30.6,"precip_mm":0.0,"precip_in":0.0,"humidity":84,"cloud":14,"feelslike_c":12.9,"feelslike_f":55.
2,"windchill_c":12.9,"windchill_f":55.2,"heatindex_c":12.7,"heatindex_f":54.9,"dewpoint_c":10.0,"dewpoint_f":50.0,"will_it_rain":0,"will
_it_snow":0,"vis_km":19.3,"vis_miles":11.0},{"time_epoch":1490428800,"time":"2017-03-25 
01:00","temp_c":12.4,"temp_f":54.3,"is_day":0,"condition":
{"text":"Clear","icon":"//cdn.apixu.com/weather/64x64/night/113.png","code":1000},"wind_mph":1.6,"wind_kph":2.5,"wind_degree":249,"wind_
dir":"WSW","pressure_mb":1021.0,"pressure_in":30.6,"precip_mm":0.0,"precip_in":0.0,"humidity":87,"cloud":20,"feelslike_c":12.5,"feelslik
e_f":54.5,"windchill_c":12.5,"windchill_f":54.5,"heatindex_c":12.4,"heatindex_f":54.3,"dewpoint_c":10.3,"dewpoint_f":50.5,"will_it_rain"
:0,"will_it_snow":0,"vis_km":19.4,"vis_miles":12.0}, {//........ continues on
```
