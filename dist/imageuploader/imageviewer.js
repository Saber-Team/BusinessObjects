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
    } else {
        factory( global );
    }
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
    var instantiated = '';

    function ImageViewerFactory () {
        var domString = [
            '<div class="o-imageviewer">',
                '<div class="imageviewer-wrapper">',
                    '<span class="imageviewer-close"></span>',
                    '<img>',
                '</div>',
            '</div>'
        ].join('');
        var $dom = $(domString).appendTo(document.body);
        var $img = $dom.find('img');
        var size = {};

        $dom.on('click', function (e) {
            e.preventDefault();
            if (e.target.tagName === 'IMG') {
                return false;
            }
            $dom.hide();
        });

        function setSize() {
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
            $img.css({'height': size.height, 'width': size.width});
        }
        function resetSize() {
            $img.css({'height': 'auto', 'width': 'auto'});
        }

        return {
            getSize: function (src, callback) {
                var img = new Image();
                img.onload = function () {
                    size = {
                        width: this.width,
                        height: this.height
                    };
                    setSize();
                    callback(src);
                };
                img.src = src;
            },
            open: function (src) {
                $img.attr('src', src);
                $dom.show();
                return $dom;
            },
            close: function () {
                $dom.hide();
                return $dom;
            },
            destroy: function () {
                $dom.off();
                $img = null;
                $dom.remove();
                $dom = null;
            }
        }
    }
    window.ImageViewer = {
        open: function (src) {
            if (!instantiated) {
                instantiated = ImageViewerFactory();
            }
            instantiated.getSize(src, instantiated.open);
            //return instantiated.open(src);
        },
        close: function () {
            return instantiated && instantiated.close();
        },
        destroy: function () {
            return instantiated && instantiated.destroy();
        }
    };

    return window.ImageViewer;
}));
