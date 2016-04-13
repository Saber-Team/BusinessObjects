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

    function TabList(opts) {
        this.opts = $.extend({}, defaultConf, opts);
        this.init();
    }

    $.extend(TabList.prototype, {
        init: function () {
            this.opts.container = this.opts.container || '.zdh-tab-list';
            this.$container = $(this.opts.container);
            this.$actived = $('.active', this.opts.container);

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

                $tar.addClass('active');
                self.$actived = $tar;

                self.$container.trigger({
                    type: 'ui.tab.list',
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

    UI.TabList = TabList;
})(window.businessUI || (window.businessUI = {}));
