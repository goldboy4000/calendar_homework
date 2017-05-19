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
    var year = [].shift.call(arguments) || new Date().getFullYear();

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

    this.chosenDay = new Date().getDate();

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
     * Array of tasks
     * @type {Array}
     */
    this.tasks = [];

    /**
     * Modal window for entering tasks
     * @type {Modal}
     */
    this.modal = new Modal('.modal');

    /**
     * _private_
     * Creates navigation for calendar
     * @returns {Element}
     */
    var getNavigationElement = function ()
    {
        var nav = document.createElement('div');
        nav.className = 'columns';
        nav.appendChild(getColumn(getButton('previous', '', 'fa fa-arrow-circle-o-left')));
        nav.appendChild(getColumn(getTag('date', 'title', 'is-primary', 'is-large', NAMES_OF_MONTHS[month] + ' ' + year), 'is-three-quarters'));
        nav.appendChild(getColumn(getButton('next', '', 'fa fa-arrow-circle-o-right')));

        return nav;
    };

    /**
     * _private_
     * Creates header element for calendar
     * @returns {Element}
     */
    var getHeader = function ()
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
    var getBody = function ()
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
    var getCalendarElement = function ()
    {
        var calendar = document.createElement('table');
        calendar.className = 'table is-bordered';
        calendar.setAttribute('id', 'calendar');

        calendar.appendChild(getHeader());
        calendar.appendChild(getBody());

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
     * @param message
     */
    this.addTask = function (message)
    {
        var taskDate = new Date(year, month, this.chosenDay);

        var task = new Task(message, taskDate);
        this.tasks.push(task);
        this.render();
    };

    /**
     *
     */
    this.removeTask = function (id)
    {
        this.tasks.forEach(function(task, index)
        {
            if (task instanceof Task && task.id === id)
            {
                this.tasks.splice(index, 1);
                this.render();
            }
        }.bind(this));
    };

    /**
     *
     */
    this.init = function ()
    {
        var navigationContainer = document.querySelector(navigation);
        navigationContainer.addEventListener('click', calendarNavClickHandler.bind(this));
        var calendarContainer = document.querySelector(container);
        calendarContainer.addEventListener('click', calendarClickHandler.bind(this));
        calendarContainer.addEventListener('success', modalSuccessHandler.bind(this));

        var data = localStorage.getItem('tasks');
        try
        {
            var srcTasks = JSON.parse(data);

            srcTasks.forEach(function (obj)
            {
                var task = new Task(obj.task, new Date(obj.date));
                this.tasks.push(task);
            }.bind(this));
        }
        catch(err)
        {
            this.tasks = [];
        }

        return this;
    };

    /**
     *
     */
    this.render = function ()
    {
        month = [].shift.call(arguments) || month;
        year = [].shift.call(arguments) || year;

        // rendering navigation panel for calendar
        var navigationContainer = document.querySelector(navigation);
        navigationContainer.innerHTML = '';
        navigationContainer.appendChild(getNavigationElement());

        // rendering calendar
        var calendarContainer = document.querySelector(container);
        var table = calendarContainer.querySelector('#calendar');
        if (table)
        {
            calendarContainer.removeChild(table);
        }
        calendarContainer.appendChild(getCalendarElement());

        //rendering tasks
        this.tasks.forEach(function(task)
        {
            if (task instanceof Task && task.date.getMonth() === month)
            {
                var taskDay = calendarContainer.querySelector('#day' + task.date.getDate());
                var taskList = taskDay.querySelector('.task_list');
                if (!taskList)
                {
                    taskList = getTaskList();
                    taskDay.insertBefore(taskList, taskDay.childNodes[0]);
                }
                taskList.appendChild(task.render());
            }
        });

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
            this.removeTask(idToRemove);
        }

        return;
    }

    var cell = target.closest('td');
    if (cell)
    {
        this.chosenDay = cell.id.slice(3);

        this.modal.show('Event on ' + this.chosenDay + ' ' + NAMES_OF_MONTHS[this.month] + ' ' + this.year);
    }

}

/**
 *
 * @param e
 */
function modalSuccessHandler(e)
{
    this.addTask(e.detail.message);
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
