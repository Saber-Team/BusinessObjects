define(['../../lib/jquery'], function ($) {
  var tabCard = {
    init: function() {
      this.$border = $('.border', '.tab-header');
      this.$border.width($('label:first', '.tab-header').width());
      this.bindEvents();
    },
    bindEvents: function() {
      var self = this;
      $('.tab-header').on('click', '.tab-cell', function(e){
        var $tar = $(e.target);
        self.$border.stop(false, true).animate({'left' : $tar.offset().left + 'px', 'width': $tar.width()},300);
      })
    }
  };
  return tabCard;
});
