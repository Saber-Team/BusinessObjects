/**
 * @fileOverview 图片popup查看弹出浮层
 * @author xiongchengbin
 * @version 1.0.0
 * @example
 * ImageViewer.open('http://preview.quanjing.com/ibrm042/iblkim01420439.jpg');
 * ImageViewer.close();
 *
 */

window.ImageViewer = (function(){
  var instantiated;

  function init() {
    var domString = [
      '<div class="o-imageviewer">',
        '<img>',
      '</div>'
    ].join('');
    var $dom = $(domString).appendTo(document.body);

    $dom.on('click', function(e) {
      e.preventDefault();
      if (e.target.tagName === 'IMG') {
        return false;
      }
      $dom.hide();
    });

    return {
      open: function(src) {
        $dom.children('img').attr('src', src);
        $dom.show();
        return $dom;
      },
      close: function(){
        $dom.hide();
        return $dom;
      },
      destroy: function() {
        $dom.off();
        $dom.remove();
        $dom = null;
      }
    }
  }

  return  {
    open: function(src) {
      if (!instantiated) {
        instantiated = init();
      }
      return instantiated.open(src);
    },
    close: function() {
      return instantiated && instantiated.close();
    },
    destroy: function() {
      return instantiated && instantiated.destroy();
    }
  }
})();
