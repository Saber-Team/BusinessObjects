/**
 * @file timepicker
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

        // custom class
        theme: undefined,

        // time conf
        hourStep  : 1,
        miniteStep: 1,

        // placeholder
        hourPlaceholder  : '',
        minitePlaceholder: '',

        // events
        onHourChange  : loop,
        onMiniteChange: loop,
        onTimeChange  : loop, // either hour or minite change

    }

    var Dropdown = UI.Dropdown

    function loop () {}

    function zeroPad (num) {
        return num < 10 ? '0' + num : '' + num
    }

    // parse 'xx:xx' to {hour:xx, minite: xx}
    function parseTime (str) {
        var ret = {}
        var timeArr
        if (str.split) {
            timeArr    = str.split(':')
            ret.hour   = timeArr[0]
            ret.minite = timeArr[1]
        }
        return ret
    }

    function Timepicker (opt) {
        if (!(this instanceof Timepicker)) {
            return new Timepicker(opt)
        }
        opt = opt || {}
        $.extend(this, defaultConf, opt)
        this.uniqueId = idCounter++

        // value
        this.hour    = undefined
        this.minite  = undefined
        this.hourEnd = 23

        this.init()
    }

    // static methods
    Timepicker.parseTime = parseTime
    Timepicker.zeroPad   = zeroPad

    // prototype
    Timepicker.prototype = {
        constructor: Timepicker,

        // create picker
        init: function () {
            var me = this
            if (!this.inited) {
                // component wrapper
                this.field.wrap('<div class="' + rootClass + '"></div>')
                this.group = this.field.parent()
                // hourPicker container
                this.group.append('<div class="' + hourClass + '"></div>')
                // minitePicker container
                this.group.append('<div class="' + miniteClass + '"></div>')
                // customer class
                this.theme && this.group.addClass(this.theme)

                this.field.css('display', 'none')

                // hourPicker
                this.hourPicker = new Dropdown({
                    el: $('.' + hourClass, this.group),
                    placeholder: this.hourPlaceholder,
                    onSelect: function (val) {
                        me.hourSelect(val)
                    }
                })
                // minitePicker
                this.minitePicker = new Dropdown({
                    el         : $('.' + miniteClass, this.group),
                    placeholder: this.minitePlaceholder,
                    onSelect   : function (val) {
                        me.miniteSelect(val)
                    }
                })

                // fill
                this.fillHour()
                this.fillMinite()

                // init value
                if (this.field.val() !== '') {
                    this.setTime(this.field.val())
                }

                this.inited = true
            }
        },

        setTime: function (timestring) {
            var time = parseTime(timestring)
            this.setHour(time.hour * 1)
            this.setMinite(time.minite * 1)
        },

        setHour: function (hour) {
            var step = this.hourStep
            hour = Math.ceil(hour / step) * step
            this.hour = hour
            this.hourPicker.setValue(hour)
        },

        setMinite: function (minite) {
            var step = this.miniteStep
            minite = Math.ceil(minite / step) * step
            this.minite = minite
            this.minitePicker.setValue(minite)
        },

        getTime: function () {
            return {
                hour  : this.hour,
                minite: this.minite
            }
        },

        getTimeString: function () {
            var ret = ''
            if (this.hour !== undefined && this.minite !== undefined) {
                ret = [this.hour, this.minite].map(zeroPad).join(':')
            }
            return ret
        },

        getHour: function () {
            return this.hour
        },

        getMinite: function () {
            return this.minite
        },

        // set min time
        setMinTime: function (timestring) {
            var time = parseTime(timestring)
            this.setMinHour(time.hour * 1)
            this.setMinMinite(time.minite * 1)
        },

        setMinHour: function (hour) {
            this.minHour = hour
            this.fillHour(hour)
            if (this.minHour > this.hour) {
                this.setHour(hour)
            }
        },

        setMinMinite: function (minite) {
            this.minMinite = minite
            this.fillMinite(minite)
            if (this.minMinite > this.minite) {
                this.setMinite(minite)
            }
        },

        hourSelect: function (hour) {
            this.setHour(hour)
            this.fillField()
            this.fillMinite()
            if (hour >= 24) {
                this.setMinite(0)
            }
            this.onHourChange(hour)
            this.onTimeChange(hour, this.minite)
        },

        miniteSelect: function (minite) {
            this.setMinite(minite)
            this.fillField()
            this.onMiniteChange(minite)
            this.onTimeChange(this.hour, this.minite)
        },

        fillHour: function (start, end) {
            var items = []
            var item
            start = start === undefined ? 0 : start * 1
            end   = end === undefined ? this.hourEnd : end * 1
            step  = this.hourStep

            if (step > 1) {
                end = 24
            }
            this.hourEnd = end
            while (start < end + step) {
                item = {
                    value: start,
                    text : zeroPad(start)
                }
                if (start === this.hour) {
                    item['selected'] = true
                }
                items.push(item)
                start += step
            }

            this.hourPicker.render(items)
        },

        fillMinite: function (start, end) {
            var items = []
            var item
            start = start * 1 || 0
            end   = end * 1 || 59
            step  = this.miniteStep

            if (this.minHour !== undefined & this.hour !== undefined) {
                if (this.hour <= this.minHour) {
                    start = this.minMinite
                }
            }

            if (this.hour >= 24) {
                end = 0
            }

            while (start <= end) {
                item = {
                    value: start,
                    text : zeroPad(start)
                }
                if (start === this.minite) {
                    item['selected'] = true
                }
                items.push(item)
                start += step
            }

            this.minitePicker.render(items)
        },

        fillField: function () {
            this.field.val(this.getTimeString())
        },

        disable: function () {
            this.hourPicker.disable()
            this.minitePicker.disable()
        },

        destroy: function () {
            this.hourPicker.destroy()
            this.minitePicker.destroy()
            for (var k in this) {
                delete this[k]
            }
        }
    }

    UI.Timepicker = Timepicker
})(this.businessUI || (this.businessUI = {}))
