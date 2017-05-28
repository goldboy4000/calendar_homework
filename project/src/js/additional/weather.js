/**
 * Created by LaBestia on 28.05.2017.
 */

/**
 *
 * @param city
 * @param country
 * @param units
 * @param lang
 * @constructor
 */
function Weather(city, country, units, lang)
{
    this.element = document.querySelector('#weather-box');

    this.city = city || 'Minsk';
    this.country = country || 'by';
    this.units = units || 'metric';
    this.lang = lang || 'ru';

    this.init();
}

/**
 *
 */
Weather.prototype.init = function ()
{
    var closeButton = document.querySelector('#close-weather');
    closeButton.addEventListener('click', closeWeatherClickHandler.bind(this));
};

/**
 *
 */
Weather.prototype.getInfo = function ()
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=' + this.city + ',' + this.country + '&APPID=fac89aa646dd8482a386ae7aa00fcdbb&units=' + this.units + '&lang=' + this.lang, true);
    xhr.send();

    xhr.addEventListener('load', loadWeatherHandler.bind(this));
};

/**
 *
 * @param jsonStr
 * @returns {null}
 */
Weather.prototype.parse = function (jsonStr)
{
    try
    {
        var jsonObj = JSON.parse(jsonStr);
    }
    catch (err)
    {
        return null;
    }

    return jsonObj;
};

/**
 *
 * @param e
 */
function closeWeatherClickHandler(e)
{
    this.element.style.display = 'none';
}

/**
 *
 * @param e
 */
function loadWeatherHandler(e)
{
    var xhr = e.target;
    if (xhr.status !== 200)
    {
        console.log('status = ' + xhr.status);
    }
    else
    {
        var jsonObj = this.parse(xhr.responseText);

        if (jsonObj)
        {
            var weatherImage = document.querySelector('#weather-image');
            var weatherTemperatureElement = document.querySelector('#weather-temperature');
            var weatherCityElement = document.querySelector('#weather-city');
            var weatherDescriptionElement = document.querySelector('#weather-description');

            if (jsonObj.weather[0])
            {
                weatherImage.src = 'http://openweathermap.org/img/w/' + jsonObj.weather[0].icon + '.png';
                weatherDescriptionElement.innerHTML = jsonObj.weather[0].description;
            }

            var sign = '';
            if (+jsonObj.main.temp > 0)
            {
                sign = '+';
            }
            else if (+jsonObj.main.temp < 0)
            {
                sign = '-';
            }

            weatherTemperatureElement.innerHTML = sign + jsonObj.main.temp + '\u2103';
            weatherCityElement.innerHTML = jsonObj.name;
        }
    }
}