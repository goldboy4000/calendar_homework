/**
 * Created by LaBestia on 11.05.2017.
 */
;
//var eventWindow = document.getElementById('event_window2');
//console.log(eventWindow);

window.onload = function()
{
    var showButton = document.getElementById('show_button');
    showButton.addEventListener('click', showButtonClickHandler);

    /**
     *
     * @param e
     */
    function showButtonClickHandler(e)
    {
        // var target = e.target;
        // alert(target.id + ' was clicked!');

        var addNewEventWindow = showModal('event_window', 'Event on random day');
        addNewEventWindow.addEventListener('success', closeWindowHandler);

    }

    /**
     *
     * @param e
     */
    function closeWindowHandler(e)
    {
        var target = e.target;
        console.log('close event target = ' + target.className + ' with custom parameter = ' + e.customParam);

        target.removeEventListener('success', closeWindowHandler);
    }


};

// var showModal = function(elementId)
//                 {
//                     var eventWindow = document.getElementById(elementId);
//                     eventWindow.classList.add('is-active');
//                     eventWindow.addEventListener('click', modalButtonsHandler);
//
//                     function modalButtonsHandler(e)
//                     {
//                         var target = e.target;
//
//                         if (target.id === 'success_button')
//                         {
//                             this.classList.remove('is-active');
//
//                             var closeEvent = document.createEvent("Event");
//                             closeEvent.initEvent("success", true, true);
//                             closeEvent.customParam = document.getElementById('event_text').value;
//
//                             eventWindow.dispatchEvent(closeEvent);
//                         }
//
//                         if (target.id === 'cancel_button' || target.id === 'close_button')
//                         {
//                             this.classList.remove('is-active');
//                         }
//                     }
//
//                     return eventWindow;
//                 };


