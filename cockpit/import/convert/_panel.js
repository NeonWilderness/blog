/**
 * Change foundation5 panel to vuetify standard (v-alert)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 */
const convertPanel = (story, $, log) => {

  log.set('panel');

  $('.panel').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    let hasCallout = $el.hasClass('callout');
    $el.removeClass('panel callout')
      .addClass('radius')
      .attr(':value', 'true')
      .attr('color', hasCallout ? 'cyan' : 'grey');
    el.tagName = 'v-alert';
    log.item(story.fm.basename, before, $.html(el));
  });

};

module.exports = convertPanel;
