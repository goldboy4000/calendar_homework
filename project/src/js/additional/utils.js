/**
 * Created by LaBestia on 15.05.2017.
 */

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
 * @param classAtrr
 * @param color
 * @param size
 * @param text
 * @param hasButton
 * @returns {Element}
 */
var getTag = function (id, classAtrr, color, size, text, hasButton)
{
    var tag = document.createElement('span');
    tag.className = 'tag';
    tag.classList.add(classAtrr);
    tag.classList.add(color);
    tag.classList.add(size);
    tag.setAttribute('id', id);
    var task = document.createTextNode(text);
    tag.appendChild(task);
    if (hasButton)
    {
        var button = document.createElement('button');
        button.className = 'delete is-small';
        button.setAttribute('id', 'delete');
        tag.appendChild(button);
    }

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