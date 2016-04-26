/**
 * @file datepicker
 * @author jinwei01
 */
;(function (UI, undefined) {

    var idCounter = 0

    // class conf
    var activeClass   = 'active'
    var selectedClass = 'selected'
    var disabledClass = 'disabled'
    var hiddenClass   = 'hidden'
    var rootClass     = 'zdh-timepicker-group'
    var hourClass     = 'hourpicker'
    var miniteClass   = 'minitepicker'

    // conf
    var defaultConf = {
        field       : null,
        triggerEvent: 'click',
        autohide    : true,

        // custom class
        theme: undefined,

        // time
        hourStep   : 1,
        miniteStep : 1,


        // events
        onHourSelect   : loop,
        onMiniteSelect : loop

    }

    // datepicker structure
    var pickerTpl = [

    ].join('')

    var Dropdown = UI.Dropdown

    function loop () {}

    function zeroPad (num) {
        return num < 10 ? '0' + num : '' + num
    }

    function Timepicker (opt) {
        if (!(this instanceof Timepicker)) {
            return new Timepicker(opt)
        }
        opt = opt || {}
        $.extend(this, defaultConf, opt)
        this.uniqueId = idCounter++

        // value
        this.hour   = undefined
        this.minite = undefined

        this.init()
    }


    Timepicker.prototype = {
        constructor: Timepicker,

        // create picker
        init: function () {
            var me = this
            if (!this.inited) {
                this.field.wrap('<div class="' + rootClass + '"></div>')
                this.group = this.field.parent()
                this.group.append('<div class="' + hourClass + '"></div>')
                this.group.append('<div class="' + miniteClass + '"></div>')
                this.theme && this.group.addClass(this.theme)
                this.field.css('display', 'none')

                this.hourPicker = new Dropdown({
                    el: $('.' + hourClass, this.group),
                    onSelect: function (val) {
                        me.hourSelect(val.value)
                    }
                })
                this.minitePicker = new Dropdown({
                    el: $('.' + miniteClass, this.group),
                    onSelect: function (val) {
                        me.miniteSelect(val.value)
                    }
                })

                // fill
                this.fillHour()
                this.fillMinite()

                this.inited = true
            }

        },

        setTime: function (hour, minite) {
            this.setHour(hour)
            this.setMinite(minite)
        },

        setHour: function (hour) {
            this.hour = hour
            this.hourPicker.select(hour)
        },

        setMinite: function (minite) {
            this.minite = minite
            this.minitePicker.select(minite)
        },

        getTime: function () {
            return {
                hour   : this.hour,
                minite : this.minite
            }
        },

        getHour: function () {
            return this.hour
        },

        getMinite: function () {
            return this.minite
        },

        hourSelect: function (hour) {
            this.onHourSelect(hour)
        },

        miniteSelect: function (minite) {
            this.onMiniteSelect(minite)
        },

        // bind events
        bind: function () {

        },

        fillHour: function (start, end, step) {
            var items = []
            start = start || 0
            end   = end || 24
            step  = step || this.hourStep

            while (start <= end) {
                items.push({
                    value: start,
                    text : zeroPad(start)
                })
                start += step
            }

            this.hourPicker.render(items)
        },

        fillMinite: function (start, end, step) {
            var items = []
            start = start || 0
            end   = end || 59
            step  = step || this.miniteStep

            while (start <= end) {
                items.push({
                    value: start,
                    text : zeroPad(start)
                })
                start += step
            }

            this.minitePicker.render(items)
        },

        destroy: function () {
            for (var k in this) {
                delete this[k]
            }
        }
    }

    UI.Timepicker = Timepicker
})(this.businessUI || (this.businessUI = {}))
