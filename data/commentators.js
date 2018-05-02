(function ($) {

  $.getJSON('https://rawgit.com/NeonWilderness/blog/master/data/commentators.json', function (json) {
    $(function () {
      let ViewModel = function () {
        this.first20 = function() {
          return json.map( function(rank, index){
            if (rank.author !== 'NeonWilderness' && index < 21) return rank;
          });
        };
      };
      let vm = new ViewModel();
      ko.applyBindings(vm, document.getElementById('kommentarhelden'));
    });
  })
    .fail(function () {
      toastr.error('Sorry, die Kommentarhelden können derzeit nicht gelesen werden!');
    });

})(jQuery);