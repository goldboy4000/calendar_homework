/**
 * Created by LaBestia on 21.05.2017.
 */

/**
 *
 * @constructor
 */
function Menu (selector, buttonId, monthSelectorId, yearSelectorId)
{
    this.selector = selector;

    this.el = document.querySelector(this.selector);

    this.buttonId = buttonId;
    this.monthSelectorId = monthSelectorId;
    this.yearSelectorId = yearSelectorId;
}

/**
 *
 * @returns {Menu}
 */
Menu.prototype.init = function ()
{
    this.el.addEventListener('click', showButtonClickHandler.bind(this));
    this.el.addEventListener('change', selectorChangeHandler.bind(this));

    return this;
};

/**
 *
 */
Menu.prototype.renderButton = function ()
{
     var showButton = getSimpleButton(this.buttonId, 'Show', 'is-primary');
     showButton.setAttribute('disabled', '');

     this.el.appendChild(showButton);
};

/**
 *
 */
Menu.prototype.renderSelectors = function ()
{
    var monthsSelector = getSelector(this.monthSelectorId);
    monthsSelector.appendChild( getOption(-1, '-choose month-') );

    for (var month = 0; month < NAMES_OF_MONTHS.length; month++)
    {
        monthsSelector.appendChild( getOption(month, NAMES_OF_MONTHS[month]) );
    }
    this.el.appendChild(monthsSelector);

    var yearSelector = getSelector(this.yearSelectorId);
    yearSelector.appendChild( getOption(-1, '-choose year-') );

    for (var year = new Date().getFullYear(); year >= 1900; year--)
    {
        yearSelector.appendChild( getOption(year, year) );
    }
    this.el.appendChild(yearSelector);
};

/**
 *
 */
Menu.prototype.render = function ()
{
    this.renderButton();
    this.renderSelectors();
};

/**
 *
 * @param e
 */
function showButtonClickHandler(e)
{
    var target = e.target;

    if (target.id === this.buttonId && !target.hasAttribute('disabled'))
    {
        monthSelector = document.getElementById(this.monthSelectorId);
        yearSelector = document.getElementById(this.yearSelectorId);

        var event = new CustomEvent('selectdate',
            {
                bubbles: true,
                detail:
                    {
                        month: monthSelector[monthSelector.selectedIndex].value,
                        year: yearSelector[yearSelector.selectedIndex].value
                    }
            });

        this.el.dispatchEvent(event);
    }

}

/**
 *
 */
function selectorChangeHandler()
{
    var showButton = document.getElementById(this.buttonId);
    var monthSelector = document.getElementById(this.monthSelectorId);
    var yearSelector = document.getElementById(this.yearSelectorId);

    if (monthSelector.selectedIndex !== 0 && yearSelector.selectedIndex !== 0)
    {
        showButton.removeAttribute('disabled');
    }
    else
    {
        showButton.setAttribute('disabled', '');
    }
}
