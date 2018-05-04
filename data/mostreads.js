(function ($) {

  $.getJSON('https://rawgit.com/NeonWilderness/blog/master/data/mostreads.json', function (json) {
    $(function () {
      let ViewModel = function () {
        this.topreads = function() { return json; };
      };
      let vm = new ViewModel();
      ko.applyBindings(vm, document.getElementById('tag-27-most-read-stories'));
    });
  })
    .fail(function () {
      toastr.error('Sorry, die meistgelesenen Stories können derzeit nicht geladen werden!');
    });

})(jQuery);