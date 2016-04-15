/**
 * @file radio.js 提供一组数据, 生成相关的html片段以绑定相关事件
 *      opts = {
 *          container: "", // 元素selector, 生成的checkbox html将插入到里面
 *          keyName: "", // radio 的 name
 *          default: false, // 动态生成时,是否默认第一个选择
 *          data: [ // radio 内容
 *              {
 *                  label: "checkbox1", // 必须提供
 *                  value: "xxx", // 必须提供
 *                  id: "xxx" // 可选, 以当前时间的md5值 加数组index作为id
 *              },
 *              ....
 *          ],
 *      }
 *
 */
;(function (UI) {
    var loop = function () {
    };

    var defaultConf = {
        default: false,
        container: 'body',
        keyName: 'radio',
        onChange: loop,
        data: []
    };

    var ITEM_CLASS_NAME = 'zdh-radio';

    function Radio(opts) {
        this.opts = $.extend({}, defaultConf, opts);
        this.init();
    }

    $.extend(Radio.prototype, {
        init: function () {
            this.onChange = this.opts.onChange;
            this.$container = $(this.opts.container);
            this.updateSelector();
            this.isNew = !this.$radio.length;
            if (this.isNew) {
                this.keyName = this.opts.keyName;
                this.keyValue = this.getValue(true);
                this.render();
                this.updateSelector();
                this.opts.default && (this.$radio[0].checked = true);
            }
            else {
                this.keyName = this.$radio.attr('name');
                this.keyValue = this.getValue();
                this.bindEvents();
            }
        },
        render: function () {
            var self = this;
            var tpl = '';
            $.each(self.opts.data, function (idx, item) {
                if (item && typeof item === 'object' && item.value && item.label) {
                    tpl += self.getTemplate(item, idx);
                }
            });
            this.$container.html(tpl);
            this.bindEvents();
        },
        addItem: function (data) {
            if (!data || typeof data !== 'object' || !data.label || !data.value) {
                throw 'The data format error, property label or value not found';
                return this;
            }
            this.$container.append(this.getTemplate(data, this.$radio.length));
            this.updateSelector();
            return this;
        },
        getTemplate: function (data, idx) {
            var self =  this;
            if (!data.id || $('#' + data.id).length) {
                data.id = this.getUniqueId(idx)
            }
            return [
                '<div class="' + ITEM_CLASS_NAME + '">',
                    '<input type="radio" id="' + data.id + '" value='+ data.value + ' name="' + self.keyName + '">',
                    '<label for="' + data.id + '">' + data.label + '</label>',
                '</div>'
            ].join('');
        },
        bindEvents: function () {
            var self = this;
            self.$container.off('change').on('change', 'input[type=radio]', function (e) {
                var $tar = $(e.target);
                var state = e.target.checked;
                var previousValue = self.keyValue;
                var currentValue = $tar.val();

                e.preventDefault();

                self.keyValue = currentValue;
                self.$container.trigger({
                    type: 'ui.radio.change',
                    target: $tar,
                    checked: state,
                    previousValues: previousValue,
                    currentValues: currentValue,
                    index: self.$radio.index(e.target)
                });
                self.onChange(previousValue, currentValue, e);

            });
        },
        updateSelector: function () {
            this.$radio = this.$container.find('.' + ITEM_CLASS_NAME + ' input[type=radio]');
        },
        getValue: function (fromOptions) {
            var self = this;
            var value;
            if (fromOptions) {
                self.opts.default && (value = self.opts.data[0].value);
            }
            else {
                self.$radio.each(function (idx, radio) {
                    if (radio.checked) {
                        value = radio.getAttribute('value') || radio.value;
                        return false;
                    }
                });
            }
            return value;
        },
        getKeyValue: function () {
            return {
                key: this.keyName,
                value: this.keyValue
            }
        },
        getContainer: function () {
            return this.$container;
        },
        getUniqueId: function (idx) {
            if (!this.time) {
                this.time = new Date().getTime();
            }
            return this.time + '_' + idx;
        },
        setCallback: function (cb) {
            this.onChange = cb || loop;
            return this;
        },
        removeItemByValue: function(val) {
            var ele;
            for (var i = 0; i < this.$radio.length; ++i) {
                if (this.$radio[i].value === val) {
                    ele = this.$radio[i];
                    break;
                }
            }
            if (ele) {
                $(ele).parent().remove();
                this.updateSelector();
                return true;
            }
            return false;
        },
        removeItemByIndex: function(idx) {
            var ele = this.$radio[idx];
            if (ele) {
                $(ele).parent().remove();
                this.updateSelector();
                return true;
            }
            return false;
        }
    });
    UI.Radio = Radio;
})(window.businessUI || (window.businessUI = {}));
