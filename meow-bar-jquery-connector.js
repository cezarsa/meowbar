(function(global, $) {
    MeowBar.connector = {
        bindEvent: function(el, ev, handler) {
            $(el).on(ev, handler);
        },
        unbindEvent: function(el, ev, handler) {
            $(el).off(ev, handler);
        },
        preventDefault: function(ev) {
            ev.preventDefault();
        },
        elementHeight: function(el) {
            return $(el).height();
        },
        topMargin: function(el) {
            el = $(el);
            return parseInt(el.css('margin-top'), 10) + parseInt(el.css('border-top-width'), 10);
        }
    };
}(this, jQuery));
