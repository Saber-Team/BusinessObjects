// todos:
// 1. validate
// 2. auto adjust height

;(function (UI) {

    function Textarea (opt) {
        this.el        = opt.el;
        this.textarea  = opt.textarea || $('textarea', this.el)
        this.counter   = opt.counter || $('.textarea-counter', this.el)
        this.maxlength = opt.maxlength || this.textarea.attr('maxlength') * 1
        this.init()
    }

    $.extend(Textarea.prototype, {
        init: function () {
            this.bind()
            this.setCounter()
        },

        bind: function () {
            var me = this
            this.textarea.keyup(function () {
                me.setCounter()
            })

            // lock scroll
            // referrence: http://www.zhangxinxu.com/wordpress/2015/12/element-scroll-prevent-parent-element-scroll-js/
            this.textarea.on('mousewheel DOMMouseScroll', function(e) {
                var scrollTop    = this.scrollTop
                var scrollHeight = this.scrollHeight
                var height       = this.clientHeight

                var delta = (e.originalEvent.wheelDelta) ? e.originalEvent.wheelDelta : -(e.originalEvent.detail || 0)

                if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
                    this.scrollTop = delta > 0 ? 0 : scrollHeight
                    e.preventDefault()
                }
           })
        },

        setCounter: function () {
            var sum = this.textarea.val().length;
            this.el.parent().toggleClass('zdh-error', sum > this.maxlength)
            $('em', this.counter).html(Math.max(this.maxlength - sum, 0))
        }
    })

    UI.Textarea = Textarea
})(this.businessUI || (this.businessUI = {}))
