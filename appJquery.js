var convertTempScale = function(temp, toCelsius) {
  var result = temp;
  if (toCelsius) {
    result -= 32.0;
    result = result / 1.8;
  } else {
    result = result * 1.8;
    result += 32;
  }
  return result;
};

var convertSpeed = function(speed, toMetric) {
  var result = speed;
  if (toMetric) {
    result = speed * 1.60934;
  } else {
    result = speed / 1.60934;
  }
  return result;
};

var convertPressure = function(pressure, toMb) {
  var newPressure = pressure;
  if (toMb) {
    newPressure = pressure * 33.8638864;
  } else {
    newPressure = pressure / 33.8638864;
  }
  return newPressure;
};

$(document).ready(function() {
  var states = ["isRainy", "partly-cloudy", "isSunny", "isMist", "has -overcast"];
  var currentStateObj = {
    "currentClass": "isRainy"
  };
  var api_base = "https://api.apixu.com/v1/forecast.json?key=c5ea8f0d9cf54e4db0473007171201";
  var setWeatherLook = function(state, dayStatus) {
    var newState = currentStateObj.currentClass;
    var iconString = "<i class='wi wi-";
    var endingString = "";
    var statusString = "";
    if (dayStatus === 0) {
      iconString += "night";
      endingString += " for the night.";
    } else if (dayStatus === 1) {
      iconString += "day";
      endingString += " for the day. ";
    }
    if (state.toLowerCase().search("rain") !== -1) {
      var statusString = state + endingString + iconString + "-rain'</i>";
      $(".weather-desc").html(statusString);
      $(".content-section").addClass("isRainy");
      newState = "isRainy";
    } else if (state.toLowerCase() === "partly cloudy" || state.toLowerCase() === "cloudy" || state.toLowerCase() === "mist") {
      var statusString = state + endingString + iconString + "-partly-cloudy'</i> ";
      $(".weather-desc").html(statusString);
      $(".weather-desc").css({
        "color": "white"
      });
      $(".content-section").addClass("partly-cloudy");
      newState = "partly-cloudy";
    } else if (state.toLowerCase() === "overcast") {
      var statusString = state + endingString + "<i class='wi wi-cloudy'></i><i class='wi wi-sprinkle'></i>";
      $(".weather-desc").html(statusString);
      $(".wi-cloudy").attr("color", "gray");
      $(".content-section").addClass("overcast");
      newState = "overcast";
    } else if (state.toLowerCase() === "mist" || state.toLowerCase() === "fog") {
      var statusString = state + endingString + " <i class='wi wi-fog'></i>";
      $(".weather-desc").html(statusString);
      $(".wi-fog").attr("color", "#939496");
      $(".content-section").addClass("foggy");
      newState = "foggy";
    } else if (state.toLowerCase() === "sunny" || state.toLowerCase() === "clear skies") {
      if (dayStatus === 1) {
        var statusString = state + endingString + "<i class='wi wi-horizon-alt'></i>";
        $(".weather-desc").html(statusString);
        $(".content-section").addClass("sunny");
        newState = "sunny";
      } else {
        var statusString = "Clear skies for the night. " + "<i class='wi wi-stars'></i><i class='wi wi-night-clear'></i>";
        $(".weather-desc").html(statusString);
        $(".content-section").addClass("clear-night");
        newState = "clear-night";
      }

    }
    if (newState !== currentStateObj.currentClass) {
      $(".content-section").removeClass(currentStateObj.currentClass);
    }
    currentStateObj.currentClass = newState;
  };
  /*
   var api_key = "&appid=8f4a778f76fb893671edf23fa1d008fe";
   var api_query_base = "http://api.openweathermap.org/data/2.5/weather?";*/
  var initialLongitude = -117.7934;
  var initialLatitude = 33.6839;
  var checkDir = function(lat, long) {
    var vertIcon = "S";
    var horizIcon = "E";
    if (lat >= 0.0) {
      vertIcon = "N";
    }
    if (vertIcon !== $(".vertical-dir").text()) {
      $(".vertical-dir").text(vertIcon);
    }
    if (long < 0.0) {
      horizIcon = "W";
    }
    if (horizIcon !== $(".horizontal-dir").text()) {
      $(".horizontal-dir").text(horizIcon);
    }
  };
  var setLocation = function(city, state, country) {
    $(".area-load").children().eq(0).html("Local Area:    " + city + " State:    " + state + " Country:    " + country);
  };
  var setTemperatures = function(current_temperature, avgTemp, minTemp, maxTemp, feelsTemp, humidity, description, time) {
    $("h1 .placeholder-temp").text(current_temperature);
    $(".min-temp").text(minTemp);
    $(".max-temp").text(maxTemp);
    $(".feels-temp").text(feelsTemp);
    $("dd .placeholder-temp").eq(2).text(avgTemp);
    $(".placeholder-humidity").text(humidity);
    $(".placeholder-temp + .isCelsius").addClass("isFahrenheit");
    $(".placeholder-temp + .isCelsius").attr("title", "Convert to Celius");
    $(".placeholder-temp + .isCelsius").html("&deg F");
    $(".placeholder-temp + .isCelsius").removeClass("isCelsius");
    setWeatherLook(description, time);
  };

  var loadWindwPrec = function(speed, direction, rotation, pressure, precipIn, precipmm) {
    $(".wind-speed").text(speed);
    $(".speed-convert + .isKm").text(" mph");
    $(".speed-convert + .isKm").addClass("isMiles");
    $(".speed-convert + .isKm").removeClass("isKm");
    var dirString = direction + " <i class='wi wi-wind wi-towards-" + direction.toLowerCase() + "'></i>";
    $(".wi-wind").css({
      "color": "purple"
    });
    $(".json-stringy .dl-horizontal dd:nth-of-type(2)").html(dirString);
    $(".json-stringy .dl-horizontal dd:nth-of-type(3)").html(rotation.toString() + " &deg");
    $(".pressure-val").text(pressure);
    $(".pressure-val + .inMb").addClass("inHg");
    $(".pressure-val + .inMb").removeClass("inMb");
    $(".pressure-val .pressure-convert").text(" inches Hg");
    $(".precip .dl-horizontal dd:first-of-type").text(precipIn.toString() + " inches");
    $(".precip .dl-horizontal dd:nth-of-type(2)").text(precipmm.toString() + " millimeters");
  };

  var loadTimes = function(sunRise, sunSet, moonRise, moonSet) {
    $(".sun-times .dl-horizontal dd:first-of-type").html("<strong>" + sunRise + "</strong>");
    $(".sun-times .dl-horizontal dd:nth-of-type(2)").html("<strong>" + sunSet + "</strong>");
    $(".moon-times .dl-horizontal dd:first-of-type").html("<strong>" + moonRise + "</strong>");
    $(".moon-times .dl-horizontal dd:nth-of-type(2)").html("<strong>" + moonSet + "</strong>");
  };

  var getJSONS = function(initialLat, initialLong) {
    var api_query = api_base + "&q=" + initialLat.toString() + "," + initialLong.toString();
    $("#json-link").attr({
      "href": api_query,
      "target": "_blank",
      "title": "Click here to see the JSON response in another tab"
    });
    $.ajax({
      url: api_query,
      success: function(response) {
        var responseString = JSON.stringify(response);
        var baseObject = JSON.parse(responseString);
        $("#putJSON").text(baseObject.location.name);
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
  /*
  $("#load-json").load(api_query, function(response, status) {
    if (status === "success") {
      var baseObject = JSON.parse(response);
      $("#load-json").text(baseObject.current.condition.text);
      var foreCast = baseObject.forecast.forecastday[0];
      setLocation(baseObject.location.name, baseObject.location.region, baseObject.location.country);
      setTemperatures(baseObject.current.temp_f, foreCast.day.avgtemp_f, foreCast.day.mintemp_f, foreCast.day.maxtemp_f, baseObject.current.feelslike_f, baseObject.current.humidity, foreCast.day.condition.text, baseObject.current.is_day);
      loadWindwPrec(baseObject.current.wind_mph, baseObject.current.wind_dir, baseObject.current.wind_degree, baseObject.current.pressure_in, foreCast.day.totalprecip_in, foreCast.day.totalprecip_mm);

    } else {
      alert("Connection Error: Cannot get Weather Forecast.\nPlease Try Again Later");
    }
  }); 
  */

  var testCoords = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        initialLongitude = position.coords.longitude;
        initialLatitude = position.coords.latitude;
        $(".lat-load").text(Math.abs(initialLatitude).toFixed(2));
        $(".longt-load").text(Math.abs(initialLongitude).toFixed(2));
        checkDir(initialLatitude, initialLongitude);
        getJSONS(initialLatitude, initialLongitude);
      });
    }
  };
  $(".switchScale").on("click", function() {
    var currentTemp = Number($(this).prev().text());
    var convertBool = true;
    if ($(this).hasClass("isFahrenheit")) {
      $(this).removeClass("isFahrenheit");
      $(this).addClass("isCelsius");
      $(this).attr("title", "Convert to Fahrenheit");
      $(this).html("&deg C");
    } else {
      $(this).removeClass("isCelsius");
      $(this).addClass("isFahrenheit");
      $(this).attr("title", "Convert to Celius");
      $(this).html("&deg F");
      convertBool = false;
    }
    var newTemp = convertTempScale(currentTemp, convertBool);
    $(this).prev().text(newTemp.toFixed(2));

  });
  $(".speed-convert").on("click", function() {
    var currentSpeed = Number($(".wind-speed").text());
    var newSpeed = currentSpeed;
    if ($(".speed-convert").hasClass("isMiles")) {
      newSpeed = convertSpeed(currentSpeed, true);
      $(".speed-convert").removeClass("isMiles");
      $(".speed-convert").addClass("isKm");
      $(".speed-convert").text(" kph");
      $(".speed-convert").attr("title", "Click to convert this to mph");
    } else {
      newSpeed = convertSpeed(currentSpeed, false);
      $(".speed-convert").addClass("isMiles");
      $(".speed-convert").removeClass("isKm");
      $(".speed-convert").text(" mph");
      $(".speed-convert").attr("title", "Click to convert this to kph");
    }
    $(".wind-speed").text(newSpeed.toFixed(2));
  });
  $(".pressure-convert").on("click", function() {
    var bool = true;
    var currentPressure = Number($(this).prev().text())
    if ($(this).hasClass("inHg")) {
      $(this).addClass("inMb");
      $(this).removeClass("inHg");
      $(this).text(" millibars");
    } else {
      bool = false;
      $(this).addClass("inHg");
      $(this).removeClass("inMb");
      $(this).text(" inches Hg");
    }
    var newPressure = convertPressure(currentPressure, bool);
    $(this).prev().text(newPressure.toFixed(2));
  });
  $(".api-btn").on("click", function() {
    if ($(this).hasClass("notClicked")) {
      $(this).addClass("isClicked");
      $(this).removeClass("notClicked");
    } else {
      $(this).addClass("notClicked");
      $(this).removeClass("isClicked");
    }
    testCoords();
  });
  /*
  var offset = $(".label-info").css("left");
  offset = offset.replace("px", "");
  var offsetNumber = Number(offset);
  offsetNumber += 16;
  var coordOffset = offsetNumber + 18;
  offset = offsetNumber.toString() + "px";
  */
  var btnWidth = $(".api-btn").css("width");
  $(".label-info").css({
    "max-width": btnWidth
  });
});
/*
coordOffset = (coordOffset).toString() + "px";
$(".coordinate-load").css({
  "left": coordOffset
});
*/
