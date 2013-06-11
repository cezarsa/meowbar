(function(global) {

    var MeowBar = function(realScrollable, fakeScrollable) {
        this.realScrollable = realScrollable;
        this.fakeScrollable = fakeScrollable;
        this.currentPos = 0;
        this.initiated = false;

        this.createElements();
        this.bindEvents();
    };

    MeowBar.prototype = {
        constructor: MeowBar,
        margin: 5,

        createElements: function() {
            this.actualBarElement = document.createElement('div');

            this.handlingArea = document.createElement('div');
            this.handlingArea.appendChild(this.actualBarElement);

            this.scrollBar = document.createElement('div');
            this.scrollBar.className = 'meow-bar';
            this.scrollBar.appendChild(this.handlingArea);

            this.fakeScrollable.appendChild(this.scrollBar);
        },

        refreshDimensions: function() {
            this.calculateDimensions();

            this.handlingArea.style.height = Math.round(this.scrollHeight) + 'px';

            var topPos = this.margin + (this.relation * this.realScrollable.scrollTop);
            this.setScrollbar(topPos);

            if (!this.initiated) {
                this.initiated = true;
                var self = this;
                setTimeout(function() {
                    self.scrollBar.className = 'meow-bar initiated';
                }, 0);
            }
        },

        calculateDimensions: function() {
            var realHeight = this.realScrollable.scrollHeight,
                viewportTotalHeight = this.fakeScrollable.offsetHeight,
                viewportHeight = viewportTotalHeight - (2 * this.margin),
                relation = viewportHeight / realHeight;

            var height = 0;
            if (viewportTotalHeight < realHeight) {
                height = relation * viewportHeight;
            }

            this.scrollHeight = height;
            this.viewportHeight = viewportHeight;
            this.relation = relation;
        },

        handleDrag: function(ev) {
            var self = this,
                startPos = ev.clientY;

            this.mousemoveHandler = function(ev) {
                self.incrementScroll(ev.clientY - startPos);
                self.updateScroll();
                startPos = ev.clientY;
            };
            MeowBar.connector.bindEvent(document, 'mousemove', this.mousemoveHandler);
        },

        stopDrag: function() {
            if (this.mousemoveHandler) {
                MeowBar.connector.unbindEvent(document, 'mousemove', this.mousemoveHandler);
            }
            if (this.mouseupHandler) {
                MeowBar.connector.unbindEvent(document, 'mouseup', this.mouseupHandler);
            }
        },

        updateScroll: function() {
            var scrollPos = (this.currentPos - this.margin) / this.relation;
            this.realScrollable.scrollTop = scrollPos;
        },

        setScrollbar: function(pos) {
            pos = Math.max(this.margin, Math.min(this.viewportHeight - this.scrollHeight + this.margin, pos));
            this.currentPos = pos;
            this.handlingArea.style.top = Math.round(pos) + 'px';

            if (this.relation >= 1) {
                this.handlingArea.style.display = 'none';
            } else {
                this.handlingArea.style.display = 'block';
            }
        },

        incrementScroll: function(increment) {
            this.setScrollbar(this.currentPos + increment);
        },

        bindEvents: function() {
            var self = this;
            self.scrollHandler = function(ev) {
                var topPos = self.margin + (self.relation * self.realScrollable.scrollTop);
                self.setScrollbar(topPos);
            };
            self.mousedownHandler = function(ev) {
                MeowBar.connector.preventDefault(ev);

                self.handleDrag(ev);
                self.mouseupHandler = function(ev) {
                    MeowBar.connector.preventDefault(ev);

                    self.stopDrag();
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
            this.stopDrag();
        }
    };

    global.MeowBar = MeowBar;

}(this));