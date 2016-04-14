/**
 * @file dropdown
 * @author jinwei01
 */
;(function(UI) {

    var idCounter = 0

    var loop = function() {}

    var defaultConf = {
        // 自定义class
        // theme:    : undefined,
        // 自动收起
        autohide  : true,
        // label 和 list等宽
        equalWidth: true,
        // events
        onShow    : loop,
        onClose   : loop,
        onSelect  : loop
    }

    var activeClass   = 'active' // dropdown active state
    var labelClass    = 'dropdown-label' // label
    var listClass     = 'dropdown-list' // list
    var itemClass     = 'dropdown-item' // list item
    var selectedClass = 'selected' // item selected

    function Dropdown(opt) {

        if (!(this instanceof Dropdown)) {
            return new Dropdown(opt)
        }

        opt = opt || {}

        $.extend(this, defaultConf, opt)

        this.uid  = idCounter++
        this.el   = opt.el
        this.list = $('.' + listClass, this.el)

        // auto init
        this.init()
    }

    $.extend(Dropdown.prototype, {
        init: function() {
            // equal width label
            this.equalWidth && this.el.addClass('equalwidth')
            // customer class
            this.theme && this.el.addClass(this.theme)
            // items count
            this.len   = $('.' + itemClass, this.el).length
            // bind events
            this.bind()
        },

        show: function() {
            this.toggle(true)
            this.onShow()
        },

        hide: function() {
            this.toggle(false)
            this.onClose()
        },

        focus: function(index) {
            index = Math.max(index, 0)
            index = Math.min(index, this.len - 1)
            $('.' + itemClass, this.el).eq(index).trigger('click.dropdown.select')
            this.hide()
        },

        select: function(val) {
            this.setLabel(val.text)
            this.onSelect(val)
        },

        toggle: function(isDisplay) {
            isDisplay   = isDisplay || !this.isOpen
            this.isOpen = isDisplay

            this.el.toggleClass(activeClass, isDisplay)
        },

        render: function(items) {
            this.empty()
            this.list.html(
                items.map(function(item) {
                    return '<li data-value="' + (item.value || '') + '" class="' + itemClass + '">' + (item.text || '') + '</li>'
                }).join('')
            )
        },

        empty: function() {
            this.list.html('')
            this.len = 0
            this.selectIndex = undefined
        },

        setLabel: function(text) {
            this.label || (this.label = $('.' + labelClass, this.el))
            this.label.html(text)
        },

        bind: function() {
            var me = this

            this.el.on('click.dropdown.show', '.' + labelClass, function(e) {
                // 模拟event capture
                !me.isOpen && setTimeout(function() {
                    me.show()
                }, 0)
            })

            // select
            this.el.on('click.dropdown.select', '.' + itemClass, function(e) {
                var item = $(e.target)
                var index
                index = item.index()
                if (index !== me.selectIndex) {

                    me.selectIndex !== undefined && $('.' + itemClass, me.el).eq(me.selectIndex).removeClass(selectedClass)
                    item.addClass(selectedClass)

                    me.selectIndex = index

                    me.select({
                        text: item.html(),
                        value: item.data('value')
                    })
                }
                me.hide()
            })

            // hide
            $(document).on('click.dropdown.hide.' + this.uid, function() {
                me.isOpen && me.autohide && me.hide()
            })
        },

        destroy: function() {
            this.el.empty()
            this.el.off('click')
            this.el.remove()

            $(document).off('click.dropdown.hide.' + this.uid)

            for (var k in this) {
                delete this[k]
            }
        }
    })

    UI.Dropdown = Dropdown

})(this.businessUI || (this.businessUI = {}))
