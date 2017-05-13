/**
 * Created by LaBestia on 11.05.2017.
 */
;

function Calendar()
{
    var today = new Date();

    this.month = today.getMonth();
    this.year = today.getFullYear();
}

Calendar.prototype.render = function(userMonth, userYear)
{
    var itself = this;

    var month = userMonth ? this.month = userMonth : this.month;
    var year = userYear ? this.year = userYear : this.year;

    var calendar;
    if (calendar = document.getElementById('calendar'))
    {
        document.body.removeChild( calendar );
    }

    calendar = document.createElement('table');
    calendar.addEventListener('click', calendarClickHandler);

    calendar.className = 'table is-bordered';
    calendar.setAttribute('id', 'calendar');

    var caption = document.createElement('caption');
    caption.innerHTML = NAMES_OF_MONTHS[month] + ' ' + year;
    calendar.appendChild(caption);

    // Обязательно переработать
    // Кнопки через фабрику
            var previousMonth = document.createElement('a');
            caption.appendChild(previousMonth);

            previousMonth.className = 'button is-primary';
            previousMonth.setAttribute('id', 'previous');
            previousMonth.addEventListener('click', calendarNavHandler);

            var span = document.createElement('span');
            previousMonth.appendChild(span);

            span.className = 'icon';
            var el = document.createElement('i');
            span.appendChild(el);
            el.className = 'fa fa-arrow-circle-o-left';

            var nextMonth = document.createElement('a');
            caption.appendChild(nextMonth);

            nextMonth.className = 'button is-primary';
            nextMonth.setAttribute('id', 'next');
            nextMonth.addEventListener('click', calendarNavHandler);

            span = document.createElement('span');
            nextMonth.appendChild(span);

            span.className = 'icon';
            el = document.createElement('i');
            span.appendChild(el);
            el.className = 'fa fa-arrow-circle-o-right';
    // Обязательно переработать


    var thead = document.createElement('thead');
    calendar.appendChild(thead);

    var headerRow = document.createElement('tr');
    thead.appendChild(headerRow);

    for (var i = 0; i < NAMES_OF_DAYS.length; i++)
    {
        var column = document.createElement('th');
        column.innerHTML = NAMES_OF_DAYS[i];
        headerRow.appendChild(column);
    }

    var tbody = document.createElement('tbody');
    calendar.appendChild(tbody);

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

    document.body.appendChild( calendar );

    /**
     *
     * @param e
     */
    function calendarNavHandler(e)
    {
        var target = this;

        if (target.id === 'previous')
        {
            if (--itself.month === -1)
            {
                itself.month = 11;
                itself.year--;
            }
        }

        if (target.id === 'next')
        {
            if (++itself.month === 12)
            {
                itself.month = 0;
                itself.year++;
            }
        }

        itself.render(itself.month, itself.year);
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

            var addNewEventWindow = showModal('event_window', 'Event on ' + target.id.slice(3) + ' ' + NAMES_OF_MONTHS[month] + ' ' + year);
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

        /**
         *
         * @param e
         */
        function successWindowHandler(e)
        {
            var successTarget = e.target;

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
            task.innerHTML = e.customParam;
            taskList.appendChild(task);

            var del = document.createElement('span');
            del.textContent = ' [X] ';
            task.appendChild(del);

            successTarget.removeEventListener('success', successWindowHandler);
            successTarget.removeEventListener('cancel', cancelWindowHandler);
        }

        /**
         *
         * @param e
         */
        function cancelWindowHandler(e)
        {
            var cancelTarget = e.target;

            cancelTarget.removeEventListener('success', successWindowHandler);
            cancelTarget.removeEventListener('cancel', cancelWindowHandler);
        }
    }
};

/**
 *
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

