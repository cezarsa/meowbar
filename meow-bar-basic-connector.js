(function(global) {
    var getStyle = function(el, style) {
        if (el.currentStyle) {
            return el.currentStyle[style];
        } else if (window.getComputedStyle) {
            return document.defaultView.getComputedStyle(el, null).getPropertyValue(style);
        }
        return el;
    };

    MeowBar.connector = {
        bindEvent: function(el, ev, handler) {
            el.addEventListener(ev, handler, false);
        },
        unbindEvent: function(el, ev, handler) {
            el.removeEventListener(ev, handler, false);
        },
        preventDefault: function(ev) {
            ev.preventDefault();
        },
        elementHeight: function(el) {
            var top = MeowBar.connector.topMargin(el),
                borderBottom = parseInt(getStyle('borderBottomWidth'), 10),
                marginBottom = parseInt(getStyle('marginBottom'), 10);
            return el.offsetHeight - (top + borderBottom + marginBottom);
        },
        topMargin: function(el) {
            return parseInt(getStyle('borderTopWidth'), 10) + parseInt(getStyle('marginTop'), 10);
        }
    };
}(this));
