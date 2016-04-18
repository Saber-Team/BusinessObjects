/*
 * @file date range picker
 * @author jinwei01
 */
;(function (UI) {

    var highlightModeClass = 'highlight-mode'
    var highlightClass     = 'highlight'

    var defaultConf = {
        startRange: undefined,
        endRange  : undefined,

        dayInterval: 0,

        startPickerOpt: {},
        endPickerOpt  : {}
    }


    var Datepicker     = UI.Datepicker
    var toDate         = Datepicker.toDate
    var getSizeOfMonth = Datepicker.getSizeOfMonth

    function Daterangepicker (opt) {
        if (!(this instanceof Daterangepicker)) {
            return new Daterangepicker(opt)
        }
        opt = opt || {}
        $.extend(this, defaultConf, opt)
        this.init()
        this.bind()
    }

    $.extend(Daterangepicker.prototype, {

        constructor: Daterangepicker,

        init: function () {
            var startPickerOpt    = this.startPickerOpt
            var endPickerOpt      = this.endPickerOpt
            var originalOnSelect  = startPickerOpt.onSelect
            var originalOnSelect2 = endPickerOpt.onSelect
            var originalOnShow2   = endPickerOpt.onShow
            var originalOnClose2  = endPickerOpt.onClose
            var interval          = 24 * 60 * 60 * 1000 * this.dayInterval

            var me = this

            // patch
            startPickerOpt.onSelect = function (date) {
                var d
                originalOnSelect && originalOnSelect.call(this, date)
                d = new Date(date.valueOf() + interval)
                me.startRange = d
                // set endpicker minDate
                me.endPicker.setMinDate(d)
                // set range
                me.endPicker.setRange(d)
            }
            endPickerOpt.onShow = function () {
                originalOnShow2 && originalOnShow2.call(this)
                me.startRange && me.endRange && me.endPicker.setRange(me.startRange, me.endRange)
            }
            endPickerOpt.onSelect = function (date) {
                originalOnSelect2 && originalOnSelect2.call(this, date)
                me.endRange = date
                me.startRange && this.setRange(me.startRange, date)
            }
            endPickerOpt.onClose = function (date) {
                originalOnClose2 && originalOnClose2.call(this, date)
                me.clearHighlight()
            }

            startPickerOpt.field = this.startField
            endPickerOpt.field   = this.endField

            // init components
            this.startPicker = new Datepicker(startPickerOpt)
            this.endPicker   = new Datepicker(endPickerOpt)
        },

        highlight: function (date) {
            var picker  = this.endPicker
            var curDate = toDate([picker.year, picker.month + 1, date].join('/'))
            var start   = this.startRange
            var index   = 1
            var total   = 0

            var formerDate

            if (curDate > start) {
                this.clearHighlight()
                index = curDate.getFullYear() === picker.year && start.getMonth() === picker.month ? start.getDate() : 1
                while (index <= date) {
                    $('td[date=' + index + ']', picker.dateGrid).addClass(highlightClass)
                    index++
                    total++
                }

                if (total) {
                    picker.dateGrid.addClass(highlightModeClass)
                    this.highlighted  = true
                }

                formerDate = date
            }
        },

        clearHighlight: function () {
            if (this.highlighted) {
                this.endPicker.dateGrid.removeClass(highlightModeClass)
                $('.' + highlightClass, this.endPicker.dateGrid).removeClass(highlightClass)
                this.highlighted  = false
            }

        },

        bind: function () {
            var me          = this
            var startPicker = this.startPicker
            var endPicker   = this.endPicker

            // hover
            var minInterval = 120
            var hoverTimer  = null
            endPicker.dateGrid.on('mouseenter', 'td[date]:not(.disable)', function (e) {
                var date
                if (!me.startRange) {
                    return
                }
                if (hoverTimer) {
                    clearTimeout(hoverTimer)
                }
                date = $(e.target).attr('date') * 1
                if (date) {
                    hoverTimer = setTimeout(function () {
                        me.highlight(date)
                    }, minInterval, date)
                }
            })
            endPicker.dateGrid.on('mouseleave', function () {
                clearTimeout(hoverTimer)
                me.clearHighlight()
            })
        },

        destroy: function () {
            this.endPicker.off('mouseenter')
            this.endPicker.off('mouseleave')
            this.startPicker.destroy()
            this.endPicker.destroy()
            for (var k in this) {
                delete this[k]
            }
        }
    })

    UI.Daterangepicker = Daterangepicker
})(this.businessUI || (this.businessUI = {}))
