/**
 * Created by LaBestia on 11.05.2017.
 */
;

/**
 * Constant names of months
 * @type {[*]}
 */
var NAMES_OF_MONTHS =  ['Январь', 'Февраль', 'Март',
    'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь',
    'Октябрь', 'Ноябрь', 'Декабрь'];

/**
 *
 * @constructor
 */
function Calendar(navContainerSelector, containerSelector, initMonth, initYear)
{
    /**
     * _private_
     * Constant names of days of week
     * @type {[*]}
     */
    var NAMES_OF_DAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

    this.chosenDay = new Date().getDate();

    var month = !isNaN(+initMonth) ? +initMonth : new Date().getMonth();
    var year = !isNaN(+initYear) ? +initYear : new Date().getFullYear();

    /**
     * getter for private variable 'month'
     */
    this.__defineGetter__('month', function ()
    {
        return month;
    });

    /**
     * getter for private variable 'year'
     */
    this.__defineGetter__('year', function ()
    {
        return year;
    });

    /**
     *
     * @type {*[]}
     */
    this.namesOfDays = NAMES_OF_DAYS;

    /**
     *
     * @type {*[]}
     */
    this.namesOfMonths = NAMES_OF_MONTHS;

    /**
     *
     * @type {string}
     */
    this.id = 'calendar';

    /**
     *
     * @type {string}
     */
    this.selector = '#' + this.id;

    /**
     * _private_
     * Selector of container for navigation
     * @type {string}
     */
    var navigation = navContainerSelector;

    /**
     * _private_
     * Selector of container for calendar
     * @type {string}
     */
    var container = containerSelector;

    /**
     * Array of tasks
     * @type {{}}
     */
    this.tasks = {};

    /**
     * Key of tasks for local storage
     * @type {string}
     */
    this.tasksLocalStorageKey = 'tasks';

    /**
     * Modal window for entering tasks
     * @type {Modal}
     */
    this.modal = new Modal('.modal');

    /**
     * _private_
     * Creates navigation for calendar
     * @param title
     * @returns {Element}
     */
    var getNavigationElement = function (title)
    {
        var nav = document.createElement('div');
        nav.className = 'columns';
        nav.appendChild(getColumn(getButton('previous', '', 'fa fa-arrow-circle-o-left')));
        nav.appendChild(getColumn(getTag('date', 'title', 'is-primary', 'is-large', title), 'is-three-quarters'));
        nav.appendChild(getColumn(getButton('next', '', 'fa fa-arrow-circle-o-right')));

        return nav;
    };

    /**
     * _private_
     * Creates header element for calendar
     * @returns {Element}
     */
    this.getHeader = function ()
    {
        var thead = document.createElement('thead');

        var headerRow = document.createElement('tr');
        thead.appendChild(headerRow);

        for (var i = 0; i < this.namesOfDays.length; i++)
        {
            headerRow.appendChild( getHeaderCell(this.namesOfDays[i]) );
        }

        return thead;
    };

    /**
     * _private_
     * Creates cell for header of calendar
     * @param value
     * @returns {Element}
     */
    var getHeaderCell = function (value)
    {
        var cell = document.createElement('th');
        cell.innerHTML = value;

        return cell;
    };

    /**
     * _private_
     * Creates body element for calendar
     * @returns {Element}
     */
    this.getBody = function ()
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
                if (day < dayOfWeek && firstWeek || dayOfMonth > daysInMonth)
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
    this.getCalendarElement = function ()
    {
        var calendar = document.createElement('table');
        calendar.className = 'table is-bordered';
        calendar.setAttribute('id', this.id);

        calendar.appendChild(this.getHeader());
        calendar.appendChild(this.getBody());

        return calendar;
    };

    /**
     * Creates ul element "task list"
     * @returns {Element}
     */
    var getTaskList = function ()
    {
        var taskList = document.createElement('ul');
        taskList.setAttribute('class', 'task_list');

        return taskList;
    };

    /**
     * Adds new task
     * @param day
     * @param month
     * @param year
     * @param message
     * @returns {Calendar}
     */
    this.addTask = function (day, month, year, message)
    {
        var task = new Task(message, new Date(year, month, day));

        var key = month + '_' + year;
        if (!this.tasks[key])
        {
            this.tasks[key] = [];
        }
        this.tasks[key].push(task);

        return this;
    };

    /**
     * Removes task
     * @param id
     */
    this.removeTask = function (id)
    {
        if (this.tasks[month + '_' + year])
        {
            var currentMonthTasks = this.tasks[month + '_' + year];
            currentMonthTasks.forEach(function(task, index, tasks)
            {
                if (task instanceof Task && task.id === id)
                {
                    tasks.splice(index, 1);
                }
            }.bind(this));
        }

        return this;
    };

    /**
     * Loads saves tasks from local storage
     */
    this.loadTasksFromStorage = function ()
    {
        var data = localStorage.getItem(this.tasksLocalStorageKey);

        try
        {
            var tasksObj = JSON.parse(data);

            for (var key in tasksObj)
            {
                this.tasks[key] = [];
                tasksObj[key].forEach(function (obj)
                {
                    var task = new Task(obj.task, new Date(obj.date));
                    this.tasks[key].push(task);
                }.bind(this));
            }
        }
        catch(err)
        {
            this.tasks = {};
        }
    };

    /**
     * Setups Handlers for calendar
     */
    this.setupHandlers = function ()
    {
        var navigationContainer = document.querySelector(navigation);
        navigationContainer.addEventListener('click', calendarNavClickHandler.bind(this));

        var calendarContainer = document.querySelector(container);
        calendarContainer.addEventListener('click', calendarClickHandler.bind(this));
        calendarContainer.addEventListener('success', modalSuccessHandler.bind(this));

        window.addEventListener('pagehide', exitFromPageHandler.bind(this));

        window.addEventListener('selectdate', menuSelectDateHandler.bind(this));

        window.addEventListener('locload', locLoadHandler.bind(this));
    };

    /**
     *
     */
    this.init = function ()
    {
        this.setupHandlers();
        this.loadTasksFromStorage();

        return this;
    };

    /**
     * Rendering navigation panel for calendar
     */
    this.renderNavigationPanel = function ()
    {
        var navigationContainer = document.querySelector(navigation);
        navigationContainer.innerHTML = '';
        navigationContainer.appendChild( getNavigationElement( this.namesOfMonths[month] + ' ' + year ) );
    };

    /**
     * Rendering calendar
     */
    this.renderCalendar = function ()
    {
        var calendarContainer = document.querySelector(container);
        var table = calendarContainer.querySelector(this.selector);
        if (table)
        {
            calendarContainer.removeChild(table);
        }
        calendarContainer.appendChild(this.getCalendarElement());
    };

    /**
     * Rendering tasks
     */
    this.renderTasks = function ()
    {
        var currentMonthTasks = this.tasks[month + '_' + year];

        if (currentMonthTasks)
        {
            currentMonthTasks.forEach(function(task)
            {
                var calendar = document.querySelector(this.selector);

                if (task instanceof Task)
                {
                    var taskDay = calendar.querySelector('#day' + task.date.getDate());
                    var taskList = taskDay.querySelector('.task_list');
                    if (!taskList)
                    {
                        taskList = getTaskList();
                        taskDay.insertBefore(taskList, taskDay.childNodes[0]);
                    }
                    taskList.appendChild(task.render());
                }
            }.bind(this));
        }
    };

    /**
     *
     */
    this.render = function (renderMonth, renderYear)
    {
        month = !isNaN(+renderMonth) ? +renderMonth : month;
        year = !isNaN(+renderYear) ? +renderYear : year;

        this.renderNavigationPanel();

        this.renderCalendar();

        this.renderTasks();

        return this;
    };

    /**
     *
     * @returns {Calendar}
     */
    this.previous = function ()
    {
        if (--month === -1) {
            month = 11;
            year--;
        }

        return this;
    };

    /**
     *
     * @returns {Calendar}
     */
    this.next = function ()
    {
        if (++month === 12)
        {
            month = 0;
            year++;
        }

        return this;
    };

    /**
     *
     * @returns {Array}
     */
    this.toJSON = function()
    {
        return this.tasks;
    };

    /**
     *
     */
    this.saveTasksToStorage = function()
    {
        localStorage.removeItem(this.tasksLocalStorageKey);
        localStorage.setItem(this.tasksLocalStorageKey, JSON.stringify(this));
    };

    /**
     *
     * @param e
     */
    function locLoadHandler(e)
    {
        this.namesOfDays = e.detail.namesOfDays;
        this.namesOfMonths = e.detail.namesOfMonths;
        this.render();
    }

}

/**
 *
 * @param e
 */
function calendarClickHandler(e)
{
    var target = e.target;

    if (target.id === 'delete')
    {
        var idToRemove = +target.closest('.task').id;
        if (!isNaN(idToRemove))
        {
            this.removeTask(idToRemove).render();
        }

        return;
    }

    var cell = target.closest('td');
    if (cell)
    {
        this.chosenDay = cell.id.slice(3);

        this.modal.show('Event on ' + this.chosenDay + ' ' + this.namesOfMonths[this.month] + ' ' + this.year);
    }

}

/**
 *
 * @param e
 */
function modalSuccessHandler(e)
{
    this.addTask(this.chosenDay, this.month, this.year, e.detail.message).render();
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
 *
 * @param e
 */
function exitFromPageHandler(e)
{
    this.saveTasksToStorage();
}

/**
 *
 * @param e
 */
function menuSelectDateHandler(e)
{
    this.render(e.detail.month, e.detail.year);
}
