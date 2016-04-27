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
        // placeholder
        placeholder: '',
        // events
        onShow    : loop,
        onClose   : loop,
        onSelect  : loop
    }

    var tmpl = [
        '<label class="dropdown-label"></label>',
        '<span class="dropdown-icon"><i></i></span>',
        '<ul class="dropdown-list">',
            // '<li data-value="1" class="dropdown-item">dropdown item 1</li>',
        '</ul>'
    ].join('')


    var rootClass     = 'zdh-dropdown' // root class
    var activeClass   = 'active' // dropdown active state
    var labelClass    = 'dropdown-label' // label
    var listClass     = 'dropdown-list' // list
    var itemClass     = 'dropdown-item' // item
    var selectedClass = 'selected' // item selected
    var disabledClass = 'disabled' // disabled

    function Dropdown(opt) {

        if (!(this instanceof Dropdown)) {
            return new Dropdown(opt)
        }

        opt = opt || {}

        $.extend(this, defaultConf, opt)

        this.uid   = idCounter++
        this.el    = opt.el
        this.value = null

        // auto init
        this.el && this.init()
    }

    $.extend(Dropdown.prototype, {

        dropdownify: function (list) {
            var selectIndex
            list.wrap('<div></div>')
            this.el = list.parent()
            selectIndex = $('[selected]', list).index()
            this.items = list.html()
            this.init()
            selectIndex > -1 && this.focus(selectIndex)
            list = null
        },

        init: function() {
            this.el.html(tmpl)

            this.el.addClass(rootClass)

            this.list = $('.' + listClass, this.el)
            // render
            this.items && this.render(this.items)
            // equal width label
            this.equalWidth && this.el.addClass('equalwidth')
            // label
            this.label = $('.' + labelClass, this.el)
            this.label.attr('placeholder', this.placeholder)
            // customer class
            this.theme && this.el.addClass(this.theme)
            // items count
            this.len   = this.list.children().length

            // focus
            this.selectIndex >= 0 && this.focus(this.selectIndex)

            // bind events
            this.bind()
        },

        setValue: function (val) {
            $('[data-value=' + val + ']', this.list).trigger('click.dropdown.select')
            // this.hide()
        },

        getValue: function () {
            return this.value
        },

        show: function() {
            if (!this.disabled) {
                this.toggle(true)
                this.onShow()
            }
        },

        hide: function() {
            this.toggle(false)
            this.onClose()
        },

        toggle: function(isDisplay) {
            this.isOpen = isDisplay
            this.el.toggleClass(activeClass, isDisplay)
        },

        focus: function(index) {
            index = Math.max(index, 0)
            index = Math.min(index, this.len - 1)
            this.list.children().eq(index).trigger('click.dropdown.select')
            this.hide()
        },

        select: function(val) {
            // val = {text:'xxx', value: 'xxx'}
            this.value = val.value
            this.setLabel(val.text)
            this.onSelect(val.value)
        },

        render: function(items) {
            var html = ''
            this.empty()
            if (Array.isArray(items)) {
                if (items.length > 0) {
                    html = items.map(function(item) {
                        return '<li data-value="'
                            + (item.value === undefined ? '' : item.value)
                            + '"'
                            + (item.selected ? ' class="selected"' : '')
                            + '">'
                            + (item.text || '')
                            + '</li>'
                    }).join('')
                }
            } else {
                // string
                html = items
            }
            this.list.html(html)
            this.list.children().addClass(itemClass)
        },

        empty: function() {
            this.list.html('')
            this.len = 0
            this.selectIndex = -1
        },

        disable: function () {
            this.disabled = true
            this.el.addClass(disabledClass)
        },

        setLabel: function(text) {
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

                    me.selectIndex > -1 && me.list.children().eq(me.selectIndex).removeClass(selectedClass)
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
