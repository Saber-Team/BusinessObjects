define(function () {

    var defaultConf = {

    }

    var activeClass = 'zdh-active'
    var iconClass   = 'zdh-dropdown-icon'
    var itemClass   = 'zdh-dropdown-item'

    function Dropdown (opt) {
        opt         = opt || {}
        this.el     = opt.el
        this.isOpen = false
        this.init()
    }

    $.extend(Dropdown.prototype, {
        init: function () {
            this.bind()
        },

        open: function () {
            this.toggle(true)
        },

        close: function () {
            this.toggle(false)
        },

        toggle: function (isDisplay) {
            isDisplay   = isDisplay || !this.isOpen
            this.isOpen = isDisplay

            this.el.toggleClass(activeClass, isDisplay)
        },

        bind: function () {
            var me = this
            this.el.on('click', function (e) {
                e.stopPropagation();
            })
            this.el.on('click', '.' + iconClass, function () {
                me.toggle()
            })
            this.el.on('click', '.' + itemClass, function () {
                me.close()
            })
            $(document).on('click', function () {
                if (me.isOpen) {
                    me.close()
                }
            })
        }

    })

    return Dropdown
})
