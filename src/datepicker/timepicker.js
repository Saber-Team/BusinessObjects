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

        yearRange: [2000, 2020],
        minDate  : undefined,

        // custom class
        theme: undefined,

        // date range
        startRange: undefined,
        endRange  : undefined,

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
            
        },

        setTime: function () {

        },

        getTime: function () {

        },

        // bind events
        bind: function () {

        },

        destroy: function () {
            for (var k in this) {
                delete this[k]
            }
        }
    }

    UI.Timepicker = Timepicker
})(this.businessUI || (this.businessUI = {}))
