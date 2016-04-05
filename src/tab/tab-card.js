define(['../../lib/jquery'], function ($) {
  var tabCard = {
    init: function(options) {
      this.$border = $('.border', '.tab-header');
      this.options = options ? options : {};
      this.options.parentOffsetLeft = this.options.parentOffsetLeft || $('.tab-header').offset().left;
      var $activeLabel = $('input:checked+label', '.tab-header');
      var offsetLeft = this.options.offsetLeft || $activeLabel.offset().left - this.options.parentOffsetLeft;
      this.$border.css({'width': $activeLabel.width(), 'left': offsetLeft});
      this.bindEvents();
    },
    bindEvents: function() {
      var self = this;
      $('.tab-header').on('click', '.tab-cell', function(e){
        var $tar = $(e.target);
        var left = $tar.offset().left - self.options.parentOffsetLeft + 'px';
        self.$border.stop(false, true).animate({'left' : left, 'width': $tar.width()}, 300, 'easeInOutQuart');
      })
    }
  };
  return tabCard;
});
