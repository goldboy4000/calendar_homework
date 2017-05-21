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

    window.addEventListener('load', init);

}(window));
