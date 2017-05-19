/**
 * Created by LaBestia on 17.05.2017.
 */

/**
 * Modal window
 * @constructor
 */
function Modal(selector)
{
    this.modal = document.querySelector(selector);

    this.init();
}

/**
 * Inits handlers for modal window
 */
Modal.prototype.init = function ()
{
    this.modal.addEventListener('click', this.modalClickHandler.bind(this));
    this.modal.addEventListener('keyup', this.modalKeyUpHandler.bind(this));

    this.modal.querySelector('#success_button').disabled = true;
};

/**
 *
 * @param e
 */
Modal.prototype.modalClickHandler = function(e)
{
    var target = e.target;

    if (target.id === 'success_button')
    {
        var successEvent = new CustomEvent('success',
            {
                detail:
                    {
                        message: this.modal.querySelector('#text_input').value
                    },
                bubbles: true
            });
        this.modal.dispatchEvent(successEvent);

        this.hide();
    }

    if (target.id === 'cancel_button' || target.id === 'close_button')
    {
        this.hide();
    }

};

/**
 *
 * @param e
 */
Modal.prototype.modalKeyUpHandler = function(e)
{
    var target = e.target;

    if (target.id === 'text_input')
    {
        this.modal.querySelector('#success_button').disabled = !target.value;
    }
};

/**
 * Shows modal window
 */
Modal.prototype.show = function (title)
{
    this.modal.querySelector('#title').innerHTML = title ? title : 'New Event';
    this.modal.classList.add('is-active');
};

/**
 * Hides modal window
 */
Modal.prototype.hide = function ()
{
    this.modal.querySelector('#text_input').value = '';
    this.modal.classList.remove('is-active');
    this.modal.querySelector('#success_button').disabled = true;
};