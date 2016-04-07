define(['../../lib/jquery'], function ($) {
  var tabPill = {
    init: function(options) {
      this.options = options ? options : {};
      this.options.container = this.options.container || '.zdh-tab-pill';
      this.$sliding = $('.sliding', this.options.container);

      this.options.parentOffsetLeft = this.options.parentOffsetLeft || $(this.options.container).offset().left;
      var $activeLabel = $('input:checked+label', this.options.container);
      var offsetLeft = this.options.offsetLeft || $activeLabel.offset().left - this.options.parentOffsetLeft;
      $activeLabel.addClass('active');
      this.$sliding.css({'left': offsetLeft, 'width': $activeLabel.width()});

      this.actived = $activeLabel;

      this.bindEvents();
    },
    bindEvents: function() {
      var self = this;
      $(self.options.container).on('click', '.tab-cell', function(e) {
        var $tar = $(e.target);
        if (self.actived == $tar) {
          return;
        }
        else {
          self.actived.removeClass('active');
          self.actived = $tar;
        }
        var left = $tar.offset().left - self.options.parentOffsetLeft + 'px';
        self.$sliding.animate({'left' : left, 'width': $tar.width()}, 300, 'easeInOutQuart', function(){
          $tar.addClass('active');
          //self.$sliding.css('z-index', -1);
        });
      })
    }
  };
  return tabPill;
});
