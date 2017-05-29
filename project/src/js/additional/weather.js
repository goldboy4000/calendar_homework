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

    this.xhr = new XMLHttpRequest();

    this.init();
}

/**
 *
 */
Weather.prototype.init = function ()
{
    this.element.addEventListener('click', clickHandler.bind(this));

    this.xhr.addEventListener('load', loadWeatherHandler.bind(this));
};

/**
 *
 * @param apiLink
 */
Weather.prototype.getInfo = function (apiLink)
{
    var apiLink = apiLink || 'http://api.openweathermap.org/data/2.5/weather?q=';

    this.xhr.open('GET', apiLink + this.city + ',' + this.country + '&APPID=fac89aa646dd8482a386ae7aa00fcdbb&units=' + this.units + '&lang=' + this.lang, true);
    this.xhr.send();
};

/**
 *
 * @param jsonObj
 */
Weather.prototype.render = function(jsonObj)
{
    if (!jsonObj.list)
    {
        this.element.appendChild(this.renderForecast(this.getForecastObject(jsonObj)));
    }
    else
    {
        this.element.removeChild(this.element.querySelector('.media'));

        var today = new Date();
        var counter = 0;

        var forecastList = jsonObj.list;

        forecastList.forEach(function(forecast)
        {
            var forecastDate = new Date(forecast.dt_txt);
            if (today.getHours() > 12 && !counter)
            {
                this.element.appendChild(this.renderForecast(this.getForecastObject(forecast)));
                counter++;
            }
            if (forecastDate.getHours() === 12 && counter < 3)
            {
                this.element.appendChild(this.renderForecast(this.getForecastObject(forecast)));
                counter++;
            }
        }.bind(this));
    }
};

/**
 *
 * @param jsonObj
 * @returns {{}}
 */
Weather.prototype.getForecastObject = function(jsonObj)
{
    var forecastObj = {};

    if (jsonObj.weather[0])
    {
        forecastObj.image = 'http://openweathermap.org/img/w/' + jsonObj.weather[0].icon + '.png';
        forecastObj.description = jsonObj.weather[0].description;
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

    forecastObj.temperature = sign + Math.floor(jsonObj.main.temp) + '\u2103';
    forecastObj.city = jsonObj.name || '';

    return forecastObj;
};

/**
 *
 * @param forecastObj
 * @returns {Element}
 */
Weather.prototype.renderForecast = function(forecastObj)
{
    // image
    var img = document.createElement('img');
    img.src = forecastObj.image;
    img.alt = 'Image';

    var image = document.createElement('figure');
    image.className = 'image is-64x64';
    image.appendChild(img);

    var imageContainer = document.createElement('div');
    imageContainer.className = 'media-left';
    imageContainer.appendChild(image);

    // content
    var temperature = document.createElement('span');
    temperature.innerHTML = forecastObj.temperature;

    var city = document.createElement('span');
    city.innerHTML = forecastObj.city;

    var description = document.createElement('span');
    description.innerHTML = forecastObj.description;

    var br = document.createElement('br');

    var text = document.createTextNode(' ');

    var content = document.createElement('div');
    content.className = 'content';
    content.appendChild(temperature);
    content.appendChild(text);
    content.appendChild(city);
    content.appendChild(br);
    content.appendChild(description);

    var contentContainer = document.createElement('div');
    contentContainer.className = 'media-content';
    contentContainer.appendChild(content);

    // article
    var forecastArticle = document.createElement('article');
    forecastArticle.className = 'media';
    forecastArticle.appendChild(imageContainer);
    forecastArticle.appendChild(contentContainer);

    return forecastArticle;
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
function clickHandler(e)
{
    if (e.target.id === 'close-weather')
    {
        this.element.style.display = 'none';
    }

    if (e.target.id === 'forecast-three-days')
    {
        this.getInfo('http://api.openweathermap.org/data/2.5/forecast?q=');

        e.target.style.display = 'none';
    }
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
            this.render(jsonObj);
        }
    }
}