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

    function TabPill(opts) {
        this.opts = $.extend({}, defaultConf, opts);

        this.init();
    }

    $.extend(TabPill.prototype, {
        init: function () {
            this.opts.container = this.opts.container || '.zdh-tab-pill';
            this.$container = $(this.opts.container);
            this.$sliding = $('.sliding', this.opts.container);
            this.opts.parentOffsetLeft = this.opts.parentOffsetLeft || this.$container.offset().left;

            var $active = $('.active', this.opts.container);
            var offsetLeft = this.opts.offsetLeft || $active.offset().left - this.opts.parentOffsetLeft;

            this.$sliding.css({'left': offsetLeft, 'width': $active.width() + 20});

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
                setTimeout(function () {
                    self.$actived.removeClass('active');

                }, 50);
                setTimeout(function () {
                    $tar.addClass('active');
                }, 200);
                var left = $tar.offset().left - self.opts.parentOffsetLeft + 'px';
                self.$sliding.animate({'left': left, 'width': $tar.width() + 20}, 300, 'easeInOutQuart', function () {
                    //$tar.addClass('active');
                    self.$actived = $tar;
                    self.opts.onActive();
                });

                self.$container.trigger({
                    type: 'ui.tab.pill',
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

    UI.TabPill = TabPill;
})(window.businessUI || (window.businessUI = {}));
