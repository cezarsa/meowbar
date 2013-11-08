(function(global) {

    var baseOptions = {
        margin: 5,
        minScrollBarSize: 50,
        init: false,
        transform3d: false
    };

    var prefixes = ['-webkit-', '-moz-', '-ms-', ''];

    var MeowBar = function(realScrollable, fakeScrollable, options) {
        this.realScrollable = realScrollable;
        this.fakeScrollable = fakeScrollable;
        this.currentPos = 0;
        this.initiated = false;

        options = options || {};
        this.options = {};
        for (var option in baseOptions) {
            if (!baseOptions.hasOwnProperty(option)) {
                continue;
            }
            if (option in options) {
                this.options[option] = options[option];
            } else {
                this.options[option] = baseOptions[option];
            }
        }

        this._createElements();
        this._bindEvents();
        if (this.options.init) {
            this.refreshDimensions();
        }
    };

    MeowBar.prototype = {
        constructor: MeowBar,

        refreshDimensions: function() {
            this._calculateDimensions();

            this.handlingArea.style.height = Math.round(this.scrollHeight) + 'px';

            var topPos = this.margin + (this.relation * this.realScrollable.scrollTop);
            this._setScrollbar(topPos);

            if (!this.initiated) {
                this.initiated = true;
                var self = this;
                setTimeout(function() {
                    self.scrollBar.className = 'meow-bar initiated';
                }, 0);
            }
        },

        _createElements: function() {
            this.actualBarElement = document.createElement('div');

            this.handlingArea = document.createElement('div');
            this.handlingArea.appendChild(this.actualBarElement);

            this.scrollBar = document.createElement('div');
            this.scrollBar.className = 'meow-bar';
            this.scrollBar.appendChild(this.handlingArea);

            this.fakeScrollable.style.position = 'relative';
            this.fakeScrollable.appendChild(this.scrollBar);
        },

        _calculateDimensions: function() {
            var realHeight = this.realScrollable.scrollHeight,
                viewportTotalHeight = MeowBar.connector.elementHeight(this.fakeScrollable),
                viewportHeight = viewportTotalHeight - (2 * this.options.margin),
                relation = viewportHeight / realHeight;

            var height = 0;
            if (viewportTotalHeight < realHeight) {
                height = relation * viewportHeight;
            }

            this.scrollHeight = Math.max(this.options.minScrollBarSize, height);
            this.viewportHeight = viewportHeight;

            var adjustedViewportHeight = this.viewportHeight + height - this.scrollHeight;
            this.relation = adjustedViewportHeight / realHeight;
            this.margin = this.options.margin + MeowBar.connector.topMargin(this.fakeScrollable);
        },

        _handleDrag: function(ev) {
            var self = this,
                startPos = ev.clientY;

            this._mousemoveHandler = function(ev) {
                self._incrementScroll(ev.clientY - startPos);
                self._updateScroll();
                startPos = ev.clientY;
            };
            MeowBar.connector.bindEvent(document, 'mousemove', this._mousemoveHandler);
        },

        _stopDrag: function() {
            if (this._mousemoveHandler) {
                MeowBar.connector.unbindEvent(document, 'mousemove', this._mousemoveHandler);
                this._mousemoveHandler = null;
            }
            if (this.mouseupHandler) {
                MeowBar.connector.unbindEvent(document, 'mouseup', this.mouseupHandler);
                this.mouseupHandler = null;
            }
        },

        _updateScroll: function() {
            var scrollPos = (this.currentPos - this.margin) / this.relation;
            this.realScrollable.scrollTop = scrollPos;
        },

        _setScrollbar: function(pos) {
            pos = Math.max(this.margin, Math.min(this.viewportHeight - this.scrollHeight + this.margin, pos));
            this.currentPos = pos;
            if (this.options.transform3d) {
                for (var i = 0; i < prefixes.length; ++i) {
                    this.handlingArea.style[prefixes[i] + 'transform'] = 'translate3d(0, ' + pos + 'px, 0)';
                }
            } else {
                this.handlingArea.style.top = Math.round(pos) + 'px';
            }

            if (this.relation >= 1) {
                this.handlingArea.style.display = 'none';
            } else {
                this.handlingArea.style.display = 'block';
            }
        },

        _incrementScroll: function(increment) {
            this._setScrollbar(this.currentPos + increment);
        },

        _bindEvents: function() {
            var self = this;
            self.scrollHandler = function(ev) {
                var topPos = self.margin + (self.relation * self.realScrollable.scrollTop);
                self._setScrollbar(topPos);
            };
            self.mousedownHandler = function(ev) {
                // Right button
                if (ev.which === 3 || ev.button === 2) {
                    return;
                }
                MeowBar.connector.preventDefault(ev);

                self._stopDrag();
                self._handleDrag(ev);
                self.mouseupHandler = function(ev) {
                    MeowBar.connector.preventDefault(ev);

                    self._stopDrag();
                };
                MeowBar.connector.bindEvent(document, 'mouseup', self.mouseupHandler);
            };
            MeowBar.connector.bindEvent(this.realScrollable, 'scroll', self.scrollHandler);
            MeowBar.connector.bindEvent(this.scrollBar, 'mousedown', self.mousedownHandler);
        },

        clearEvents: function() {
            if (this.realScrollable && this.scrollHandler) {
                MeowBar.connector.unbindEvent(this.realScrollable, 'scroll', this.scrollHandler);
            }
            if (this.scrollBar && this.mousedownHandler) {
                MeowBar.connector.unbindEvent(this.scrollBar, 'mousedown', this.mousedownHandler);
            }
            this._stopDrag();
        }
    };

    global.MeowBar = MeowBar;

}(this));