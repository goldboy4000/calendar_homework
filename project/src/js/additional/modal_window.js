/**
 * Created by LaBestia on 12.05.2017.
 */

/**
 *
 * @param elementId
 * @param title
 * @returns {Element}
 */
var showModal = function(elementId, title)
{
    var eventWindow = document.getElementById(elementId);
    eventWindow.classList.add('is-active');
    eventWindow.addEventListener('click', modalButtonsHandler);

    var windowTitle = document.getElementById('title');
    windowTitle.innerHTML = title;

    function modalButtonsHandler(e)
    {
        var target = e.target;

        if (target.id === 'success_button')
        {
            this.classList.remove('is-active');

            var closeEvent = document.createEvent("Event");
            closeEvent.initEvent("success", true, true);
            closeEvent.customParam = document.getElementById('event_text').value;

            eventWindow.dispatchEvent(closeEvent);
        }

        if (target.id === 'cancel_button' || target.id === 'close_button')
        {
            this.classList.remove('is-active');
        }
    }

    return eventWindow;
};