/**
 * Created by LaBestia on 11.05.2017.
 */
;

(function (window)
{
    'use strict';

    var init = function ()
    {
        var menu = new Menu('#menu_container', 'show-button', 'month-selector', 'year-selector');
        menu.init().render();

        var calendar = new Calendar('#calendar_nav_container', '#calendar_container');
        calendar.init().render();
    };

    window.addEventListener('load', init);

}(window));
