const tabColors = [
  { tab: 'blue lighten-2', slider: 'teal darken-2' },
  { tab: 'amber lighten-1', slider: 'teal darken-2' },
  { tab: 'blue-grey lighten-3', slider: 'teal darken-2' }
]

/**
 * Change foundation5 ul.tabs to vuetify standard (v-tabs)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertTabs = (story, $, log, commentIdx = -1) => {

  log.set('tabs');

  $('ul.tabs').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    let data = [];

    $el.find('li>a').each((index, tab) => { 
      data.push(`<v-tab ripple>${$(tab).text()}</v-tab>`);
    });
    $el.next().find('>div').each((index, content) => { 
      data.push(`<v-tab-item><v-card flat><v-card-text>${$(content).html()}</v-card-text></v-card></v-tab-item>`);
    });

    let textColor = tabColors.length - 1; // last element is default (grey)
    if ($el.hasClass('tabBlue')) textColor = 0
    else if ($el.hasClass('tabYellow')) textColor = 1;
    $el
      .html(`${data.join('\n')}`)
      .attr('centered', '')
      .attr('color', tabColors[textColor].tab)
      .attr('dark', '')
      .attr('slider-color', tabColors[textColor].slider);
    delete el.attribs.class;
    el.tagName = 'v-tabs';
    log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, before, $.html(el));
  });

};

module.exports = convertTabs;
