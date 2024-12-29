import $ from 'jquery';

export function init() {

    $(() => {

        $('.js-modal-toggler').on('click', (e) => {
            e.preventDefault();
            const targetModal = $(e.currentTarget).data('target');
            showModal(targetModal);
        });  

        $('[data-quick-checkout]').on('click', (e) => {
            e.preventDefault();
            const targetModal = '.m-modal--checkout'
            showModal(targetModal);
        });  
        
    });

}

class Modal {

    private $e: JQuery;

    constructor( $e ) {

        this.$e = $e;
        $e.data('modal-api', this);

        this.$e.find('.m-modal-close').on('click', (e) => {
            e.preventDefault();
            this.hide();
        });



    }

    show() {
        this.$e.show();

        const $overlay = $('<div class="m-overlay"></div>');
        $overlay.on('click', () => {
            this.hide();
        });
        $('body').append( $overlay );
    }

    hide() {
        this.$e.hide();
        $('body > .m-overlay').remove();
    }

}

function showModal(selector) {

    const $modal = $(selector);
    let api = $modal.data( 'modal-api' );
    if (!api) {
        api = new Modal( $modal );
    }

    api.show();

}