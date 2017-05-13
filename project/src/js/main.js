/**
 * Created by LaBestia on 11.05.2017.
 */
;

/**
 * Constant names of days of week
 * @type {[*]}
 */
var NAMES_OF_DAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

/**
 * Constant names of months
 * @type {[*]}
 */
var NAMES_OF_MONTHS = ['January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December'];

/**
 *
 */
window.onload = function()
{
    var showButton = document.getElementById('show_button');
    showButton.addEventListener('click', showButtonClickHandler);
    showButton.disabled = true;

    // Init Selectors
    var monthSelector = document.getElementById('month_selector');
    monthSelector.addEventListener('change', selectorChangeHandler);
    monthSelector.appendChild(getOption(-1, '-choose month-'));

    for (var month = 0; month < NAMES_OF_MONTHS.length; month++)
    {
        monthSelector.appendChild(getOption(month, NAMES_OF_MONTHS[month]));
    }

    var yearSelector = document.getElementById('year_selector');
    yearSelector.addEventListener('change', selectorChangeHandler);
    yearSelector.appendChild(getOption(-1, '-choose year-'));

    for (var year = new Date().getFullYear(); year >= 1900; year--)
    {
        yearSelector.appendChild(getOption(year, year));
    }

    var calendar = new Calendar();
    calendar.render();

    /**
     *
     * @param e
     */
    function showButtonClickHandler(e)
    {
        calendar.render( monthSelector[monthSelector.selectedIndex].value, yearSelector[yearSelector.selectedIndex].value );
    }

    /**
     *
     */
    function selectorChangeHandler()
    {
        showButton.disabled = monthSelector.selectedIndex === 0 || yearSelector.selectedIndex ===0;
    }

    /**
     *
     * @param e
     */
    function closeWindowHandler(e)
    {
        var target = e.target;
        console.log('close event target = ' + target.className + ' with custom parameter = ' + e.customParam);

        target.removeEventListener('success', closeWindowHandler);
    }


};

/**
 *
 * @param value
 * @param text
 * @returns {Element|*}
 */
var getOption = function (value, text)
{
    var option = document.createElement('option');
    option.value = value;
    option.innerHTML = text;

    return option;
};

/**
 * Calculates days in month
 * @returns {number}
 */
Date.prototype.daysInMonth = function()
{
    return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
};

/**
 * Calculates full weeks (rows for calendar) in month
 * @returns {number}
 */
Date.prototype.fullWeeksInMonth = function()
{
    var day = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
    day = day === 0 ? 7 : day;
    var sumOfDays = day - 1 + this.daysInMonth();

    return Number(Math.floor(sumOfDays / 7) + Boolean(sumOfDays % 7));
};
