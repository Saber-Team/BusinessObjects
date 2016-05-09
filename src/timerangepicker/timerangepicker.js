/*
 * @file time range picker
 * @author jinwei01
 */
;(function (UI, undefined) {

    var defaultConf = {
        startField: undefined,
        endField  : undefined,

        noMinite: false,

        // 间隔（单位：分）
        interval: 0,

        startPickerOpt: {},
        endPickerOpt  : {}
    }


    var Timepicker = UI.Timepicker
    var parseTime  = Timepicker.parseTime
    var zeroPad    = Timepicker.zeroPad

    function Timerangepicker (opt) {
        if (!(this instanceof Timerangepicker)) {
            return new Timerangepicker(opt)
        }
        opt = opt || {}
        $.extend(this, defaultConf, opt)
        this.init()
    }

    $.extend(Timerangepicker.prototype, {

        constructor: Timerangepicker,

        init: function () {
            var startPickerOpt        = this.startPickerOpt
            var endPickerOpt          = this.endPickerOpt
            var originalOnTimeChange  = startPickerOpt.onTimeChange
            var originalOnHourChange  = endPickerOpt.onHourChange

            // interval
            var interval       = this.interval
            this.intervalHour   = Math.floor(interval / 60)
            this.intervalMinite = interval - this.intervalHour * 60

            var me = this

            // patch
            startPickerOpt.onTimeChange = function (time) {
                var h              = time.hour
                var m              = time.minite
                var interval       = me.interval
                var intervalHour   = 0
                var intervalMinite = 0

                originalOnTimeChange && originalOnTimeChange.call(this, time)

                if (h !== undefined && m !== undefined) {
                    intervalHour   = Math.floor((interval + m) / 60)
                    intervalMinite = interval + m - intervalHour * 60
                    me.endPicker.setMinHour(h + intervalHour)
                    me.endPicker.setMinMinite(intervalMinite)
                } else if (h !== undefined) {
                    me.endPicker.setMinHour(h + Math.floor(interval / 60))
                }
            }

            endPickerOpt.onHourChange = function (h) {
                originalOnHourChange && originalOnHourChange.call(this, h)
                if ( h=== this.minHour) {
                    this.setMinMinite(this.minMinite)
                }
            }

            startPickerOpt.field = this.startField
            endPickerOpt.field   = this.endField
            if (this.noMinite) {
                startPickerOpt.noMinite = true
                endPickerOpt.noMinite   = true
            }

            // init components
            this.startPicker = new Timepicker(startPickerOpt)
            this.endPicker   = new Timepicker(endPickerOpt)

            this.endPicker.fillHour(0, 24)
        },


        destroy: function () {
            this.startPicker.destroy()
            this.endPicker.destroy()
            for (var k in this) {
                delete this[k]
            }
        }
    })

    UI.Timerangepicker = Timerangepicker
})(this.businessUI || (this.businessUI = {}))
