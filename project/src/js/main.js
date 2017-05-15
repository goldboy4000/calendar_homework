/**
 * Created by LaBestia on 11.05.2017.
 */
;

/**
 * Constant names of months
 * @type {[*]}
 */
var NAMES_OF_MONTHS =  ['January', 'February', 'March',
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
    calendar.init();
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
 * Finds child element for parent node
 * @param parentNode
 * @param tagName
 * @returns {*}
 */
var findChild = function (parentNode, tagName)
{
    for (var i = 0; i < parentNode.children.length; i++)
    {
        if (parentNode.children[i].tagName === tagName.toUpperCase())
        {
            return parentNode.children[i];
        }
    }

    return null;
};

/**
 * Creates button (bulma)
 * @param id
 * @param name
 * @param icon
 * @returns {Element}
 */
var getButton = function (id, name, icon)
{
    var button = document.createElement('a');

    var span = document.createElement('span');
    span.className = 'icon is-large';
    span.setAttribute('id', id);
    button.appendChild(span);

    var el = document.createElement('i');
    el.className = icon;
    el.innerHTML = name;
    span.appendChild(el);

    return button;
};

/**
 * Creates tag (bulma)
 * @param id
 * @param kind
 * @param text
 * @returns {Element}
 */
var getTag = function (id, kind, text)
{
    var tag = document.createElement('span');
    tag.className = kind;
    tag.setAttribute('id', id);
    tag.innerHTML = text;

    return tag;
};

/**
 * Creates column for element columns (bulma)
 * @param child
 * @param size
 * @returns {Element}
 */
var getColumn = function(child, size)
{
    var column = document.createElement('div');
    column.className = 'column';
    if (size)
    {
        column.classList.add(size);
    }
    column.appendChild(child);

    return column;
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
