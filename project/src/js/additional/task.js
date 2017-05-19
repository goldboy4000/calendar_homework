/**
 * Created by LaBestia on 15.05.2017.
 */

/**
 *
 * @constructor
 */
function Task(task, date)
{
    var _task = task;

    /**
     * getter for private variable 'task'
     */
    this.__defineGetter__('task', function ()
    {
        return _task;
    });

    var _date = date;

    /**
     * getter for private variable 'date'
     */
    this.__defineGetter__('date', function ()
    {
        return _date;
    });

    var _id = this.generateId();

    /**
     * getter for private variable 'id'
     */
    this.__defineGetter__('id', function ()
    {
        return _id;
    });

    /**
     *
     */
    this.render = function ()
    {
        var taskElement = document.createElement('li');
        taskElement.appendChild(getTag(this.id, 'task', 'is-primary', 'is-small', this.task, true));

        return taskElement;
    };

}

/**
 * Generates ID for every new task
 */
Task.prototype.generateId = (function ()
{
    var counter = 0;
    return function ()
    {
        return counter++;
    }
}());
