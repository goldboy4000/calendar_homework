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

    this.namesOfMonths = NAMES_OF_MONTHS;

    this.localization = 'ru';

    this.selectedMonth = 0;

    /**
     *
     * @returns {Menu}
     */
    this.init = function ()
    {
        this.el.addEventListener('click', showButtonClickHandler.bind(this));
        this.el.addEventListener('change', selectorChangeHandler.bind(this));

        window.addEventListener('locload', locLoadHandler.bind(this));

        return this;
    };

    /**
     *
     */
    this.fillMonthSelector = function ()
    {
        var element = document.getElementById(this.monthSelectorId);
        element.innerHTML = '';
        element.appendChild( getOption(-1, '-choose month-') );

        for (var month = 0; month < this.namesOfMonths.length; month++)
        {
            element.appendChild( getOption(month, this.namesOfMonths[month]) );
        }

        element.selectedIndex = this.selectedMonth;
    };

    this.toggleLocButtons = function()
    {
        var ruLangButton = document.getElementById('ru-lang-button');
        var enLangButton = document.getElementById('en-lang-button');

        if (this.localization === 'ru')
        {
            ruLangButton.classList.add('is-outlined');
            enLangButton.classList.remove('is-outlined');
        }
        else
        {
            ruLangButton.classList.remove('is-outlined');
            enLangButton.classList.add('is-outlined');
        }
    };

    /**
     *
     * @param e
     */
    function locLoadHandler(e)
    {
        this.namesOfMonths = e.detail.namesOfMonths;
        this.fillMonthSelector();
    }
}

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
    this.el.appendChild(monthsSelector);
    this.fillMonthSelector();

    var yearSelector = getSelector(this.yearSelectorId);
    yearSelector.appendChild( getOption(-1, '-choose year-') );

    for (var year = new Date().getFullYear(); year >= 1900; year--)
    {
        yearSelector.appendChild( getOption(year, year) );
    }
    this.el.appendChild(yearSelector);
};


Menu.prototype.renderLocalizationMenu = function ()
{
    var ruLangButton = getSimpleButton('ru-lang-button', 'ru', 'is-info');
    ruLangButton.addEventListener('click', locClickHandler.bind(this));
    var enLangButton = getSimpleButton('en-lang-button', 'en', 'is-info');
    enLangButton.addEventListener('click', locClickHandler.bind(this));

    this.el.appendChild(ruLangButton);
    this.el.appendChild(enLangButton);

    this.toggleLocButtons();
};

/**
 *
 */
Menu.prototype.render = function ()
{
    this.el.innerHTML = '';

    this.renderButton();
    this.renderSelectors();
    this.renderLocalizationMenu();
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

    this.selectedMonth = monthSelector.selectedIndex;

    if (monthSelector.selectedIndex !== 0 && yearSelector.selectedIndex !== 0)
    {
        showButton.removeAttribute('disabled');
    }
    else
    {
        showButton.setAttribute('disabled', '');
    }
}

/**
 *
 * @param e
 */
function locClickHandler(e)
{
    this.localization = e.target.id.slice(0, 2);

    this.toggleLocButtons();

    var langEvent = new CustomEvent('langchange',
        {
            bubbles: true,
            detail:
                {
                    lang: this.localization
                }
        });

    this.el.dispatchEvent(langEvent);
}
