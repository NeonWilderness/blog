(function ($) {

  $.getJSON('https://rawgit.com/NeonWilderness/blog/master/data/commentators.json', function (json) {
    $(function () {
      let ViewModel = function () {
        this.topheroes = function() { return json.slice(1, 21); };
      };
      let vm = new ViewModel();
      ko.applyBindings(vm, document.getElementById('tag-29-commentator-awards'));
    });
  })
    .fail(function () {
      toastr.error('Sorry, die Kommentarhelden können derzeit nicht gelesen werden!');
    });

})(jQuery);