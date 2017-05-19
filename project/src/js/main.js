/**
 * Created by LaBestia on 11.05.2017.
 */
;

(function (window)
{
    'use strict';

    var calendar;

    var init = function ()
    {
        calendar = new Calendar();
        calendar.init().render();
    };

    var exit = function (e)
    {
        if (calendar)
        {
            localStorage.removeItem('tasks');
            localStorage.setItem('tasks', JSON.stringify(calendar));
        }
    };

    window.addEventListener('load', init);
    window.addEventListener('pagehide', exit);

}(window));
