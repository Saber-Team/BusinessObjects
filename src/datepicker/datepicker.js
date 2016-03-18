define(['../../lib/pikaday/pikaday'], function (Pikaday) {
    var defaults = {
        theme    : 'zdh-datepicker',
        format   : 'YYYY/MM/DD',
        firstDay : 1,
        minDate  : new Date(2000, 0, 1),
        maxDate  : new Date(2020, 12, 31),
        yearRange: [2000,2020],
        showDaysInNextAndPreviousMonths: true,
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

    function Datepicker(opt) {
        $.extend(defaults, opt)

        this.init()
    }
    $.extend(Datepicker.prototype, {
        init: function () {
            this.picker = new Pikaday(defaults)
        }
    })

    return Datepicker
})
