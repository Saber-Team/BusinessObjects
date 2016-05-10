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

        $dom.on('click', function (e) {
            e.preventDefault();
            if (e.target.tagName === 'IMG') {
                return false;
            }
            $dom.hide();
        });

        return {
            open: function (src) {
                $dom.find('img').attr('src', src);
                $dom.show();
                return $dom;
            },
            close: function () {
                $dom.hide();
                return $dom;
            },
            destroy: function () {
                $dom.off();
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
            return instantiated.open(src);
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
