/**
 * @file number spinner
 * @author jinwei01
 */
;(function (UI, undefined) {

    function loop () {}

    // default conf
    var defaultConf = {
        step: 1,
        // events
        onChange: loop
    }

    // class
    var groupClass    = 'zdh-numberspinner-group'
    var inputClass    = 'spinner-input'
    var plusClass     = 'spinner-plus'
    var minusClass    = 'spinner-minus'
    var disabledClass = 'disabled'

    function Spinner (opt) {
        if (!(this instanceof Spinner)) {
            return new Spinner(opt)
        }
        opt = opt || {}
        $.extend(this, defaultConf, opt)
        this.init()
        this.bind()
    }

    $.extend(Spinner.prototype, {
        init: function () {
            if (!this.inited) {
                // group wrapper
                this.field.wrap('<div class="' + groupClass + '"></div>')
                this.group = this.field.parent()
                // input filed
                this.field.addClass(inputClass)
                // minus button
                this.group.prepend('<i class="' + minusClass + '"></i>')
                this.minusButton = $('.' + minusClass, this.group)
                // plus button
                this.group.append('<i class="' + plusClass + '"></i>')
                this.plusButton = $('.' + plusClass, this.group)

                // initial data
                this.value = this.field.val() * 1 || 0
                this.min   = this.field.attr('min') * 1 || 0
                this.max   = this.field.attr('max') * 1 || Infinity

                this.toggleButton()

                this.inited = true
            }
        },

        setValue: function (val) {
            val = val * 1
            if (val !== this.value) {
                val = Math.min(this.max, val)
                val = Math.max(this.min, val)
                this.value = val
                this.toggleButton()
                this.field.val(this.value)
                // onchange callback
                this.onChange(this.value)
            }
        },

        getValue: function () {
            return this.value
        },

        // set min value
        setMin: function (min) {
            this.min = min * 1
            if (this.min > this.value) {
                this.setValue(this.min)
            } else {
                this.toggleButton()
            }
        },

        // set max value
        setMax: function (max) {
            max = max * 1
            this.max = max
            if (this.max < this.value) {
                this.setValue(this.max)
            } else {
                this.toggleButton()
            }
        },

        // ++
        plus: function () {
            this.setValue(this.value + this.step)
        },

        // --
        minus: function () {
            this.setValue(this.value - this.step)
        },

        bind: function () {
            var me = this
            // click plus button
            this.group.on('click', '.' + plusClass + ':not(.disabled)', function () {
                !me.disabled && me.plus()
            })
            // click minus button
            this.group.on('click', '.' + minusClass + ':not(.disabled)', function () {
                !me.disabled && me.minus()
            })
            // input bind
            this.field.on('change', function () {
                var val = onlyNumber($(this).val())
                me.setValue(val * 1)
            })
            this.field.on('keyup', function () {
                $(this).val(onlyNumber($(this).val()))
            })
            // ie9 donot fire change event when delete text
            this.field.on('blur', function (e) {
                var val = onlyNumber($(this).val())
                if (val * 1 !== me.value) {
                    me.setValue(val * 1)
                }
            })

            // only accept number
            function onlyNumber (val) {
                // delete not number
                val = val.replace(/[^0-9]/g, '')
                // start with 0
                val = val.replace(/^0(\d*)/, '0')
                return val
            }
        },

        // disable group
        disable: function () {
            this.disabled = true
            this.field.attr('readonly', 'readonly')
            this.group.addClass(disabledClass)
        },

        // disable/enable button
        toggleButton: function () {
            this.plusButton.toggleClass(disabledClass, this.value >= this.max)
            this.minusButton.toggleClass(disabledClass, this.value <= this.min)
        },

        destroy: function () {
            var me = this
            this.group.off('click')
            ;['change', 'blur', 'keyup'].forEach(function (event) {
                me.field.off(event)
            })
            this.group.remove()
            for (var k in this) {
                delete this[k]
            }
        }
    })

    UI.Numberspinner = Spinner
})(this.businessUI || (this.businessUI = {}))
