(function(global) {
    MeowBar.connector = {
        bindEvent: function(el, ev, handler) {
            el.addEventListener(ev, handler, false);
        },
        unbindEvent: function(el, ev, handler) {
            el.removeEventListener(ev, handler, false);
        },
        preventDefault: function(ev) {
            ev.preventDefault();
        }
    };
}(this));
