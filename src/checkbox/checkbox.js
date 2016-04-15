/**
 * @file checkbox.js 提供一组数据, 生成相关的html片段以绑定相关事件
 *      opts = {
 *          container: "", // 元素selector, 生成的checkbox html将插入到里面
 *          keyName: "", // checkbox 的 name
 *          data: [ // checkbox 内容
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
        onChange: loop
    };

    var ITEM_CLASS_NAME = 'zdh-checkbox';

    function Checkbox(opts) {
        this.opts = $.extend({}, defaultConf, opts);
        this.init();
    }

    $.extend(Checkbox.prototype, {
        init: function () {
            this.onChange = this.opts.onChange || loop;
            this.opts.container = this.opts.container || 'body';
            this.$container = $(this.opts.container);
            this.updateSelector();
            this.isNew = !this.$checkbox.length;
            if (this.isNew) {
                this.keyName = this.opts.keyName;
                this.keyValues = [];
                this.render();
                this.updateSelector();
            }
            else {
                this.keyName = this.$checkbox.attr('name');
                this.keyValues = this.getValues();
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
            this.$container.append(this.getTemplate(data, this.$checkbox.length));
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
                    '<input type="checkbox" id="' + data.id + '" value='+ data.value + ' name="' + self.keyName + '">',
                    '<label for="' + data.id + '">' + data.label + '</label>',
                '</div>'
            ].join('');
        },
        bindEvents: function () {
            var self = this;
            self.$container.off('change').on('change', 'input[type=checkbox]', function (e) {
                var $tar = $(e.target);
                var state = e.target.checked;
                var previousValues = self.keyValues;
                var currentValues = self.getValues();

                e.preventDefault();

                self.keyValues = currentValues;
                self.$container.trigger({
                    type: 'ui.checkbox.change',
                    target: $tar,
                    checked: state,
                    previousValues: previousValues,
                    currentValues: currentValues,
                    index: self.$checkbox.index(e.target)
                });
                self.onChange(previousValues, currentValues);

            });
        },
        updateSelector: function () {
            this.$checkbox = this.$container.find('.' + ITEM_CLASS_NAME + ' input[type=checkbox]');
        },
        getValues: function (fromOptions) {
            var self = this;
            var values = [];
            if (fromOptions) {
                $.each(self.opts.data, function (idx, item) {
                    values.push(item.value);
                });
            }
            else {
                self.$checkbox.each(function (idx, checkbox) {
                    if (checkbox.checked) {
                        values.push(checkbox.getAttribute('value') || checkbox.value);
                    }
                });
            }
            return values;
        },
        getKeyValue: function () {
            return {
                key: this.keyName,
                value: this.keyValues
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
            for (var i = 0; i < this.$checkbox.length; ++i) {
                if (this.$checkbox[i].value === val) {
                    ele = this.$checkbox[i];
                    break;
                }
            }
            if (ele) {
                $(ele).parent().remove();
                return true;
            }
            return false;
        },
        removeItemByIndex: function(idx) {
            var ele = this.$checkbox[idx];
            if (ele) {
                $(ele).parent().remove();
                return true;
            }
            return false;
        }
    });
    UI.Checkbox = Checkbox;
})(window.businessUI || (window.businessUI = {}));
