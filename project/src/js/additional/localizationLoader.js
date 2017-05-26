/**
 * Created by LaBestia on 24.05.2017.
 */

/**
 *
 * @constructor
 */
function LocalizationLoader(srcLocalization)
{
    this.localization = 'ru';
    this.source = srcLocalization;
}

/**
 *
 */
LocalizationLoader.prototype.init = function ()
{
    window.addEventListener('langchange', langChangeHandler.bind(this));
};

/**
 *
 */
LocalizationLoader.prototype.load = function ()
{
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', readyStateChangeHandler.bind(this));
    xhr.open('GET', this.source, true);
    xhr.send();
};

/**
 *
 * @param str
 */
LocalizationLoader.prototype.parse = function(str)
{
    try
    {
        var locParams = JSON.parse(str);
    }
    catch(err)
    {
        return null;
    }

    return locParams[this.localization + 'Lang'];
};

/**
 *
 * @param e
 */
function langChangeHandler (e)
{
    this.localization = e.detail.lang;

    this.load();
}

/**
 *
 * @param e
 */
function readyStateChangeHandler(e)
{
    if (e.target.readyState !== 4)
    {
        return;
    }

    if (e.target.status !== 200)
    {
        console.log('status = ' + e.target.status);
    }
    else
    {
        var locObj = this.parse(e.target.responseText);
        if (locObj)
        {
            var locEvent = new CustomEvent('locload',
                {
                    bubbles: true,
                    detail:
                        {
                            namesOfDays: locObj.namesOfDays,
                            namesOfMonths: locObj.namesOfMonths
                        }
                });

            window.dispatchEvent(locEvent);
        }
    }
}
