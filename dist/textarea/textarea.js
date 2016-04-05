define(function () {

    function Textarea (opt) {
        this.el       = opt.el;
        this.textarea = opt.textarea || $('textarea', this.el)
        this.counter  = opt.counter || $('.zdh-textarea-counter', this.el)
        this.maxlength      = opt.maxlength || textarea.maxlength
        this.init()
    }

    $.extend(Textarea.prototype, {
        init: function () {

            this.bind()

            this.setCounter();
        },

        bind: function () {
            var me = this
            this.textarea.keyup(function () {
                me.setCounter()
            })
        },

        setCounter: function () {
            var sum = this.textarea.val().length;
            this.el.parent().toggleClass('zdh-error', sum > this.maxlength)
            $('em', this.counter).html(this.maxlength - sum)
        }
    })

    return Textarea
})
