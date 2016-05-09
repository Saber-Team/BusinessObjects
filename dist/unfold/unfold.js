(function(UI){
    
    //设置默认样式
    var defaultConf = {
        duration : 300
    };

    var ITEM_CLASS_NAME = 'zdh-unfold';

    function Unfold(opts){
        //传递过来的参数覆盖默认值
        this.opts = $.extend({}, defaultConf, opts);
        this.$container = $(this.opts.container);
        this.init();
    }
    
    
    $.extend(Unfold.prototype,{
        init : function(){
            this.getDom();
            this.bindEvents();
        },
        getDom : function(){
            this.btn = this.$container.find('.zdh-unfold-btn');
            this.contentBox = this.$container.find('.zdh-unfold-content');
        },
        bindEvents : function(){
            var self = this;
            self.btn.on('click',function(){
                var status = self.$container.attr('status') ? self.$container.attr('status') : 'close';
                if(status == 'close'){
                    console.log('close');
                    self.$container.attr('status','open');
                    self.$container.find('.btn-text').text('收起');
                    self.$container.removeClass('zdh-unfold-close');
                    self.contentBox.show(self.opts.duration);
                }else{
                    console.log('open');
                    self.$container.attr('status','close');
                    self.$container.find('.btn-text').text('展开了解');
                    !self.$container.hasClass('zdh-unfold-close') && self.$container.addClass('zdh-unfold-close');
                    self.contentBox.hide(self.opts.duration);
                }
            })

        },
        //取消监听
        off : function(key,listener){
            if (!key && !listener) {
              this.__events = {}
            }
            //不传监听函数，就去掉当前key下面的所有的监听函数
            if (key && !listener) {
              delete this.__events[key]
            }

            if (key && listener) {
              var listeners = this.__events[key]
              var index = _indexOf(listeners, listener)

              (index > -1) && listeners.splice(index, 1)
            }

            return this;
        },
        //定义销毁的方法，一些收尾工作都应该在这里
        destroy:function(){
            //去掉所有的事件监听
            this.off();
            //删除渲染好的dom节点
            this.$container.remove();
            //去掉绑定的代理事件
            //对象置为空
            for (var k in this) {
                delete this[k]
            }
        }
    });
    UI.Unfold = Unfold;
})(window.businessUI || (window.businessUI = {}));