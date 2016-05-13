/**
 * @fileOverview 图片popup查看弹出浮层
 * @author xiongchengbin
 * @version 1.0.0
 * @example
 * ImageViewer.open('http://preview.quanjing.com/ibrm042/iblkim01420439.jpg');
 * ImageViewer.close();
 *
 */

(function( global, factory ) {

    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory( global, true );
    }
    else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define( function() { return factory( global ) });
    }
    else {
        factory( global );
    }
}(typeof window !== "undefined" ? window : this, function( window ) {

    var domString = [
        '<div class="o-imageviewer">',
            '<div class="imageviewer-wrapper">',
                '<span class="imageviewer-close"></span>',
                '<img>',
            '</div>',
        '</div>'
    ].join('');

    function ImageViewerFactory () {
        this.init();
    }
    $.extend(ImageViewerFactory.prototype, {
        init: function () {
            this.$dom = $(domString).appendTo(document.body);
            this.$img = this.$dom.find('img');
            this.bind();
        },
        bind: function () {
            var that = this;
            that.$dom.on('click', function (e) {
                e.preventDefault();
                if (e.target.tagName === 'IMG') {
                    return false;
                }
                that.hide();
            });
        },
        unbind: function () {
            this.$dom.off();
        },
        open: function (src) {
            this.getSize(src);
            return this;
        },
        hide: function () {
            this.$dom.hide();
            return this;
        },
        show: function () {
            this.$dom.show();
            return this;
        },
        setSrc: function (src) {
            this.$img.attr('src', src);
            return this;
        },
        getSize: function (src) {
            var that = this;
            var img = new Image();
            img.onload = function () {
                var size = {
                    width: this.width,
                    height: this.height
                };
                that.setSize(size, src);
            };
            img.src = src;
            return this;
        },
        setSize: function (size, src) {
            var width = window.innerWidth * .9;
            var height = window.innerHeight * .9;
            var ratio = size.width / size.height;
            if (size.width / size.height > width / height) {
                size.width = size.width > width ? width : size.width;
                size.height = size.width / ratio;
            }
            else {
                size.height > height && (size.height = height);
                size.width = size.height * ratio;
            }
            this.$img.css({'height': size.height, 'width': size.width});
            this.setSrc(src).show();
            return this;
        },
        destroy: function () {
            this.unbind();
            this.$img = null;
            this.$dom.remove();
            this.$dom = null;
        }
    });

    var instance;

    window.ImageViewer = {
        open: function (src) {
            if (!instance) {
                instance = new ImageViewerFactory();
            }
            instance.open(src);
            return instance;
        },
        close: function () {
            return instance && instance.close();
        },
        destroy: function () {
            return instance && instance.destroy();
        }
    };

    return ImageViewerFactory;
}));
