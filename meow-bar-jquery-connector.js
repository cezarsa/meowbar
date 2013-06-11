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
        }
    };
}(this, jQuery));
