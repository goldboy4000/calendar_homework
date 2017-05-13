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

    var successButton = document.getElementById('success_button');
    successButton.disabled = true;

    var textInput = document.getElementById('event_text');
    textInput.addEventListener('keyup', textInputHandler);

    /**
     *
     * @param e
     */
    function modalButtonsHandler(e)
    {
        var target = e.target;

        if (target.id === 'success_button')
        {
            this.classList.remove('is-active');

            var successEvent = document.createEvent("Event");
            successEvent.initEvent("success", true, true);
            successEvent.customParam = textInput.value;

            eventWindow.dispatchEvent(successEvent);

            textInput.value = '';
        }

        if (target.id === 'cancel_button' || target.id === 'close_button')
        {
            this.classList.remove('is-active');
            textInput.value = '';

            var cancelEvent = document.createEvent("Event");
            cancelEvent.initEvent("cancel", true, true);
            eventWindow.dispatchEvent(cancelEvent);
        }
    }

    /**
     *
     * @param e
     */
    function textInputHandler(e)
    {
        var target = e.target;

        successButton.disabled = !target.value;
    }

    return eventWindow;
};
