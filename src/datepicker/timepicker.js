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

    // conf
    var defaultConf = {
        field       : null,
        triggerEvent: 'click',
        autohide    : true,

        // custom class
        theme: undefined,

        // time
        hourStep  : 1,
        miniteStep: 1,


        // events
        onShow  : loop,
        onSelect: loop,
        onClose : loop

    }

    // datepicker structure
    var pickerTpl = [

    ].join('')

    function loop () {}

    function Timepicker (opt) {
        if (!(this instanceof Timepicker)) {
            return new Timepicker(opt)
        }
        opt = opt || {}
        $.extend(this, defaultConf, opt)
        this.uniqueId = idCounter++
        this.init()
    }


    Timepicker.prototype = {
        constructor: Timepicker,

        // create picker
        init: function () {
            if (!this.inited) {
                this.el           = this.el
                this.hourPicker   = $('.zdh-timepicker-hour select', this.el)
                this.minitePicker = $('.zdh-timepicker-minite select', this.el)

                // fill
                this.fillHour()
                this.fillMinite()

                this.inited = true
            }

        },

        setTime: function () {

        },

        getTime: function () {

        },

        // bind events
        bind: function () {

        },

        fillHour: function () {
            var h    = 0
            var step = this.hourStep
            var html = []

            while (h <= 24) {
                html.push('<option value="'+ h +'">'+ h +'</option>')
                h += step
            }

            this.hourPicker.html(html.join(''))
        },

        fillMinite: function () {
            var m    = 0
            var step = this.miniteStep
            var html = []

            while (m < 60) {
                html.push('<option value="'+ m +'">'+ m +'</option>')
                m += step
            }

            this.minitePicker.html(html.join(''))
        },

        destroy: function () {
            for (var k in this) {
                delete this[k]
            }
        }
    }

    UI.Timepicker = Timepicker
})(this.businessUI || (this.businessUI = {}))
