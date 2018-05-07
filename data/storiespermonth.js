(function ($) {

  $.getJSON('https://rawgit.com/NeonWilderness/blog/master/data/storiespermonth.json', function (json) {
    $(function () {
      var getRgba = function(color, opacity) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity.toString()})`;
      };
      var barchart = {
        type: 'bar',
        data: {
          labels: ['Beiträge je Monat'],
          datasets: [
            {
              label: 'NeonWilderness Performance',
              data: json,
              fill: false,
              backgroundColor: getRgba('#ec407a', 0.6),
              borderColor: getRgba('#ec407a', 1),
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [{ ticks: { beginAtZero: true } }]
          },
          title: {
            display: true,
            text: 'Blogbeiträge je Monat: 10/2006 &mdash; 05/2018'
          }
        }
      };
      new Chart(document.getElementById('barStoriesPerMonth'), barchart);
    });
  })
    .fail(function () {
      toastr.error('Sorry, die Chartdaten können derzeit nicht gelesen werden!');
    });

})(jQuery);