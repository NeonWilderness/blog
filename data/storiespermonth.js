(function ($) {

  $.getJSON('https://rawgit.com/NeonWilderness/blog/master/data/storiespermonth.json', function (json) {
    $(function () {
      var getRgba = function(color, opacity) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity.toString()})`;
      };
      var months = [], stories = [];
      $.each( function(index, el) {
        months.push(el.month);
        stories.push(el.count);
      });
      debugger;
      var barchart = {
        type: 'bar',
        data: {
          labels: months,
          datasets: [
            {
              label: 'NeonWilderness Performance',
              data: stories,
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
            text: 'Blogbeiträge je Monat: 10/2006 bis 05/2018'
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