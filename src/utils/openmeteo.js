export const CODES = {
    "0": "Clear Sky",
    "1": "Mostly Clear",
    "2": "Some Clouds",
    "3": "Cloudy",
    "45": "Foggy",
    "48": "Frosty Fog",
    "51": "Light Drizzle",
    "53": "Drizzle",
    "55": "Heavy Drizzle",
    "56": "Light Freezing Drizzle",
    "57": "Heavy Freezing Drizzle",
    "61": "Light Rain",
    "63": "Rain",
    "65": "Heavy Rain",
    "66": "Light Freezing Rain",
    "67": "Heavy Freezing Rain",
    "71": "Light Snow",
    "73": "Snow",
    "75": "Heavy Snow",
    "77": "Snow Grains",
    "80": "Light Rain Showers",
    "81": "Rain Showers",
    "82": "Heavy Rain Showers",
    "85": "Light Snow Showers",
    "86": "Heavy Snow Showers",
    "95": "Thunderstorm",
    "96": "Thunderstorm with Some Hail",
    "99": "Thunderstorm with Heavy Hail"
}


const formatObject = (object) => {
  const times = object?.time;
  const formated = [];

  times.forEach((time, index) => {
    const obj = {};

    for (const key in object) {
      obj[key] = object[key][index];
    }

    formated.push(obj);
  });

  return formated;
};

export const getCurrentWeatherBackground = (code, isDay) => {
    const weatherCode = code.toString();
    
    const clearStates = ["0", "1"];
    const cloudyStates = ["2", "3", "45", "48"];
    const rainyStates = ["51", "53", "55", "56", "57", "61", "63", "65", "66", "67", "80", "81", "82"];
    const snowyStates = ["71", "73", "75", "77", "85", "86"];
    const thunderStates = ["95", "96", "99"];
    
    if (clearStates.includes(weatherCode)) {
        if (isDay) {
            return "clear_day";
          } else {
            return "clear_night";
          }
    } else if (cloudyStates.includes(weatherCode)) {
        if (isDay) {
            return "cloudy_day";
          } else {
            return "cloudy_night";
          }
    } else if (rainyStates.includes(weatherCode)) {
        return "rainy";
    } else if (snowyStates.includes(weatherCode)) {
        return "snowy";
    } else if (thunderStates.includes(weatherCode)) {
        return "thunder";
    } else {
        return "Unknown";
    }
};

export const formatCurrentData = (data) => {
    const new_data = JSON.parse(JSON.stringify(data));
    new_data.current_weather.temperature = Math.round(
        new_data.current_weather.temperature
    )
    new_data.current_weather.weatherstate = CODES[new_data.current_weather.weathercode];
    new_data.current_weather.weatherbackground = getCurrentWeatherBackground(
      new_data.current_weather.weathercode,new_data.current_weather.is_day
    )
    return new_data;
}

export const formatForecastData = (data) => {
    const new_data = JSON.parse(JSON.stringify(data));
    new_data.current_weather.temperature = Math.round(
        new_data.current_weather.temperature
    )
    new_data.current_weather.weatherstate = CODES[new_data.current_weather.weathercode];
    new_data.current_weather.weatherbackground = getCurrentWeatherBackground(
      new_data.current_weather.weathercode,new_data.current_weather.is_day
    )
    new_data.daily = formatObject(new_data.daily);
    new_data.hourly = formatObject(new_data.hourly);
    new_data.daily.is_day = new_data.current_weather.is_day;
    new_data.hourly.is_day = new_data.current_weather.is_day;
    return new_data;
}


export const getCurrentData = async (location) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&temperature_unit=fahrenheit`
  );
  const data = await response.json();
  data.current_weather.temperature = Math.round(
      data.current_weather.temperature
  )
  data.current_weather.weatherstate = CODES[data.current_weather.weathercode];
  data.current_weather.weatherbackground = getCurrentWeatherBackground(
    data.current_weather.weathercode,data.current_weather.is_day
  )
  return data;
};

export const getWeatherData = async (location) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weathercode,pressure_msl,surface_pressure,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,visibility,evapotranspiration,et0_fao_evapotranspiration,vapor_pressure_deficit,windspeed_10m,windspeed_80m,windspeed_120m,windspeed_180m,winddirection_10m,winddirection_80m,winddirection_120m,winddirection_180m,windgusts_10m,temperature_80m,temperature_120m,temperature_180m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_1cm,soil_moisture_1_3cm,soil_moisture_3_9cm,soil_moisture_9_27cm,soil_moisture_27_81cm&temperature_unit=fahrenheit&windspeed_unit=mph&forecast_days=16`
  );
  const data = await response.json();
  data.daily = formatObject(data.daily);
  data.hourly = formatObject(data.hourly);
  return data;
};