/*
 * @file date range picker
 * @author jinwei01
 */
;(function (UI) {
    var defaultConf = {
        startRange: undefined,
        endRange  : undefined,

        dayInterval: 0,

        startPickerOpt: {},
        endPickerOpt  : {}
    }

    var Datepicker = UI.Datepicker

    function Daterangepicker (opt) {
        if (!(this instanceof Daterangepicker)) {
            return new Daterangepicker(opt)
        }
        opt = opt || {}
        $.extend(this, defaultConf, opt)
        this.init()
    }

    $.extend(Daterangepicker.prototype, {

        constructor: Daterangepicker,

        init: function () {
            var startPickerOpt    = this.startPickerOpt
            var endPickerOpt      = this.endPickerOpt
            var originalOnSelect  = startPickerOpt.onSelect
            var originalOnSelect2 = endPickerOpt.onSelect
            var originalOnShow    = endPickerOpt.onShow
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
                originalOnShow && originalOnShow.call(this)
                me.startRange && me.endRange && me.endPicker.setRange(me.startRange, me.endRange)
            }
            endPickerOpt.onSelect = function (date) {
                originalOnSelect2 && originalOnSelect2.call(this, date)
                me.endRange = date
                me.startRange && this.setRange(me.startRange, date)
            }

            startPickerOpt.field = this.startField
            endPickerOpt.field   = this.endField

            // init components
            this.startPicker = new Datepicker(startPickerOpt)
            this.endPicker   = new Datepicker(endPickerOpt)
        },

        destroy: function () {
            this.startPicker.destroy()
            this.endPicker.destroy()
            for (var k in this) {
                delete this[k]
            }
        }
    })

    UI.Daterangepicker = Daterangepicker
})(this.businessUI || (this.businessUI = {}))
