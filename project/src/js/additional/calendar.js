/**
 * Created by LaBestia on 11.05.2017.
 */
;

/**
 *
 * @constructor
 */
function Calendar()
{
    /**
     * _private_
     * Constant names of days of week
     * @type {[*]}
     */
    var NAMES_OF_DAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

    var month = [].shift.call(arguments) || new Date().getMonth();
    var year  = [].shift.call(arguments) || new Date().getFullYear();

    /**
     * getter for private variable 'month'
     */
    this.__defineGetter__("month",  function()
                                    {
                                        return month;
                                    });

    /**
     * getter for private variable 'year'
     */
    this.__defineGetter__("year",  function()
                                    {
                                        return year;
                                    });

    /**
     * _private_
     * Selector of container for navigation
     * @type {string}
     */
    var navigation = '#calendar_nav_container';

    /**
     * _private_
     * Selector of container for calendar
     * @type {string}
     */
    var container = '#calendar_container';

    /**
     * _private_
     * Array of tasks
     * @type {Array}
     */
    var tasks = [];

    /**
     * _private_
     * Creates navigation for calendar
     * @returns {Element}
     */
    var getNavigationElement =  function ()
                                {
                                    var nav = document.createElement('div');
                                    nav.className = 'columns';
                                    nav.appendChild( getColumn( getButton('previous', '', 'fa fa-arrow-circle-o-left') ) );
                                    nav.appendChild( getColumn( getTag('date', 'tag is-primary is-large', NAMES_OF_MONTHS[month] + ' ' + year), 'is-three-quarters' ) );
                                    nav.appendChild( getColumn( getButton('next', '', 'fa fa-arrow-circle-o-right') ) );

                                    return nav;
                                };

    /**
     * _private_
     * Creates header element for calendar
     * @returns {Element}
     */
    var getHeader = function()
                    {
                        var thead = document.createElement('thead');

                        var headerRow = document.createElement('tr');
                        thead.appendChild(headerRow);

                        for (var i = 0; i < NAMES_OF_DAYS.length; i++)
                        {
                            var column = document.createElement('th');
                            column.innerHTML = NAMES_OF_DAYS[i];
                            headerRow.appendChild(column);
                        }

                        return thead;
                    };

    /**
     * _private_
     * Creates body element for calendar
     * @returns {Element}
     */
    var getBody  =  function()
                    {
                        var tbody = document.createElement('tbody');

                        var inputDate = new Date(year, month);
                        var dayOfWeek = inputDate.getDay() === 0 ? 7 : inputDate.getDay();
                        var daysInMonth = inputDate.daysInMonth();

                        var dayOfMonth = 1;
                        var weeks = [];
                        var firstWeek = true;
                        for (var week = 0; week < inputDate.fullWeeksInMonth(); week++)
                        {
                            weeks[week] = document.createElement('tr');
                            tbody.appendChild(weeks[week]);

                            for (var day = 1; day <= 7; day++)
                            {
                                column = document.createElement('td');
                                if ( day < dayOfWeek && firstWeek || dayOfMonth > daysInMonth )
                                {
                                    column.innerHTML = '&nbsp';
                                }
                                else
                                {
                                    column.setAttribute('id', 'day' + dayOfMonth);
                                    column.innerHTML = dayOfMonth++;
                                    firstWeek = false;
                                }
                                weeks[week].appendChild(column);
                            }
                        }

                        return tbody;
                    };

    /**
     * _private_
     * Creates table element "calendar"
     * @returns {Element}
     */
    var getCalendarElement  =   function()
                                {
                                    var calendar = document.createElement('table');
                                    calendar.className = 'table is-bordered';
                                    calendar.setAttribute('id', 'calendar');

                                    calendar.appendChild(getHeader());
                                    calendar.appendChild(getBody());

                                    return calendar;
                                };

    /**
     *
     */
    var addTask  =  function()
                    {

                    };

    /**
     *
     */
    var removeTask  =   function ()
                        {

                        };

    /**
     *
     */
    this.init = function()
                {
                    var navigationContainer = document.querySelector(navigation);
                    navigationContainer.addEventListener('click', calendarNavClickHandler.bind(this));
                    var calendarContainer = document.querySelector(container);
                    calendarContainer.addEventListener('click', calendarClickHandler.bind(this));
                };

    /**
     *
     */
    this.render  =  function()
                    {
                        month = [].shift.call(arguments) || month;
                        year  = [].shift.call(arguments) || year;

                        var navigationContainer = document.querySelector(navigation);
                        navigationContainer.innerHTML = '';
                        navigationContainer.appendChild(getNavigationElement());

                        var calendarContainer = document.querySelector(container);
                        calendarContainer.innerHTML = '';
                        calendarContainer.appendChild(getCalendarElement());

                        return this;
                    };

    /**
     *
     * @returns {Calendar}
     */
    this.previous = function()
                    {
                        if (--month === -1)
                        {
                            month = 11;
                            year--;
                        }

                        return this;
                    };

    /**
     *
     * @returns {Calendar}
     */
    this.next = function()
                {
                    if (++month === 12)
                    {
                        month = 0;
                        year++;
                    }

                    return this;
                };

}


/**
 *
 * @param e
 */
function calendarClickHandler(e)
{
    var target = e.target;

    if ((target.tagName === 'TD' || target.tagName === 'LI') && target.innerHTML !== '&nbsp;')
    {
        if (target.tagName === 'LI')
        {
            target = target.parentNode.parentNode;
        }

        var addNewEventWindow = showModal('event_window', 'Event on ' + target.id.slice(3) + ' ' + NAMES_OF_MONTHS[this.month] + ' ' + this.year);

        var successWindowHandler = (function(e)
                                    {
                                        renderTask(this, e.customParam);
                                        addNewEventWindow.removeEventListener('success', successWindowHandler);
                                        addNewEventWindow.removeEventListener('cancel', cancelWindowHandler);
                                    }).bind(target);

        var cancelWindowHandler  = (function()
                                    {
                                        addNewEventWindow.removeEventListener('success', successWindowHandler);
                                        addNewEventWindow.removeEventListener('cancel', cancelWindowHandler);
                                    }).bind(target);

        addNewEventWindow.addEventListener('success', successWindowHandler);
        addNewEventWindow.addEventListener('cancel', cancelWindowHandler);
    }

    if (target.tagName === 'SPAN')
    {
        var ulParent = target.parentNode.parentNode;
        ulParent.removeChild(target.parentNode);
        if (!ulParent.children.length)
        {
            ulParent.parentNode.removeChild(ulParent);
        }
    }
}

/**
 *
 * @param e
 */
function calendarNavClickHandler(e)
{
    var target = e.target;

    while (target.id !== 'calendar_nav_container')
    {
        if (target.id === 'previous')
        {
            this.previous().render();
            break;
        }
        if (target.id === 'next')
        {
            this.next().render();
            break;
        }
        target = target.parentNode;
    }
}

/**
 * Creates task in chosen cell
 * @param target
 * @param message
 */
function renderTask(target, message)
{
    var ulChild = findChild(target, 'ul');

    var taskList;
    if (ulChild)
    {
        taskList = ulChild;
    }
    else
    {
        taskList = document.createElement('ul');
        target.insertBefore(taskList, target.childNodes[0]);
    }

    var task = document.createElement('li');
    task.innerHTML = message;
    taskList.appendChild(task);

    var del = document.createElement('span');
    del.textContent = ' [X] ';
    task.appendChild(del);
}
