/**
 * @file tab-pill
 * @author xiongchengbin
 */
;(function (UI) {
    var loop = function () {
    };

    var defaultConf = {
        onActive: loop
    };

    function TabCard(opts) {
        this.opts = $.extend({}, defaultConf, opts);
        this.init();
    }

    $.extend(TabCard.prototype, {
        init: function () {
            this.opts.container = this.opts.container || '.zdh-tab-card';
            this.$container = $(this.opts.container);
            this.$sliding = $('.sliding', this.opts.container);
            this.opts.parentOffsetLeft = this.opts.parentOffsetLeft || this.$container.offset().left;

            var $active = $('.active', this.opts.container);
            var offsetLeft = this.opts.offsetLeft || $active.offset().left - this.opts.parentOffsetLeft;

            this.$sliding.css({'left': offsetLeft, 'width': $active.width()});

            this.$actived = $active;

            this.bindEvents();
        },
        bindEvents: function () {
            var self = this;
            self.$container.on('click', '.tab-cell', function (e) {
                var $tar = $(e.target);
                var previousTab = self.$actived;

                if (self.$actived === $tar) {
                    return ;
                }

                self.$actived.removeClass('active');

                var left = $tar.offset().left - self.opts.parentOffsetLeft + 'px';
                self.$sliding.stop(false, true).animate({'left' : left, 'width': $tar.width()}, 300, 'easeInOutQuart');
                $tar.addClass('active');
                self.$actived = $tar;

                self.$container.trigger({
                    type: 'ui.tab.card',
                    previousTab: previousTab,
                    currentTab: $tar
                });
            });
        },
        getContainer: function () {
            return this.$container;
        },
        setCallback: function (cb) {
            this.opts.onActive = cb || loop;
            return this;
        },
        getInstance: function (opts) {
            if (!this.instance) {
                this.instance  = new TabPill(opts)
            }
            return this.instance;
        }
    });

    UI.TabCard = TabCard;
})(window.businessUI || (window.businessUI = {}));
