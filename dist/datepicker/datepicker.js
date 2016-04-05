define(['./pikaday'], function (Pikaday) {
    var defaults = {
        theme    : 'zdh-datepicker',
        format   : 'YYYY/MM/DD',
        firstDay : 1,
        // minDate  : new Date(2000, 0, 1),
        // maxDate  : new Date(2020, 12, 31),
        yearRange: [2000, 2020],
        i18n     : {
            previousMonth: 'Previous Month',
            nextMonth: 'Next Month',
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (val) {
                return val + '月'
            }),
            weekdays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            weekdaysShort: ['日', '一', '二', '三', '四', '五', '六']
        }
    }

    var activeClass = 'active';

    function Datepicker(opt) {
        $.extend(this.settings = {}, defaults, opt, true);
        this.init()
    }
    $.extend(Datepicker.prototype, {
        init: function () {
            this.initPicker();
        },

        initPicker: function () {
            var me = this;
            var settings = this.settings;

            // readonly
            this.field  = $(settings.field);
            this.field.prop('readonly', true);

            // monkey patch
            var originOnOpen  = settings.onOpen;
            var originOnClose = settings.onClose;

            settings.onOpen = function () {
                me.toggleActive(true);
                originOnOpen && originOnOpen.call(null);
            }
            settings.onClose = function () {
                me.toggleActive(false);
                originOnClose && originOnClose.call(null);
            }

            // start picker
            this.picker = new Pikaday(settings);
        },

        toggleActive: function (isActive) {
            this.active = isActive;
            this.field.parent().toggleClass(activeClass, isActive);
        },

        isActive: function () {
            return this.active;
        }


    })

    return Datepicker
})
