/**
 * Created by LaBestia on 11.05.2017.
 */
;
var locLoader = new LocalizationLoader();
(function (window)
{
    'use strict';

    var init = function ()
    {
        var locLoader = new LocalizationLoader('data.json');
        locLoader.init();

        var menu = new Menu('#menu_container', 'show-button', 'month-selector', 'year-selector');
        menu.init().render();

        var calendar = new Calendar('#calendar_nav_container', '#calendar_container');
        calendar.init().render();
    };

    window.addEventListener('load', init);

}(window));
