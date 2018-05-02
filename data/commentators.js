(function ($) {

  $.getJSON('https://rawgit.com/NeonWilderness/blog/master/data/commentators.json', function (json) {
    $(function () {
      let ViewModel = function () {
        this.topheroes = function() {
          var top20 = json.map( function(rank, index){
            if (rank.author !== 'NeonWilderness' && index < 21) return rank;
          });
          console.log('top20:', top20);
          return top20;
        };
      };
      let vm = new ViewModel();
      ko.applyBindings(vm, document.getElementById('tag-29-commentator-awards'));
    });
  })
    .fail(function () {
      toastr.error('Sorry, die Kommentarhelden können derzeit nicht gelesen werden!');
    });

})(jQuery);