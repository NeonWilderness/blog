(function ($) {

  $.getJSON('https://rawgit.com/NeonWilderness/blog/master/data/commentators.json', function (json) {
    $(function () {
      let ViewModel = function () {
        this.first20 = function() {
          return json.map( function(rank, index){
            console.log(`rank: ${rank}`);
            if (rank.author !== 'NeonWilderness' && index < 21) return rank;
          });
        };
      };
      let vm = new ViewModel();
      ko.applyBindings(vm, document.getElementById('tag-29-commentator-awards'));
      console.log(json);
    });
  })
    .fail(function () {
      toastr.error('Sorry, die Kommentarhelden können derzeit nicht gelesen werden!');
    });

})(jQuery);