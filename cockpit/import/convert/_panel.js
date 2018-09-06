/**
 * Change foundation5 panel to vuetify standard (v-alert)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertPanel = (story, $, log, commentIdx = -1) => {

  log.set('panel');

  $('.panel').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    let hasCallout = $el.hasClass('callout');
    $el.removeClass('panel callout')
      .addClass('radius')
      .attr(':value', 'true')
      .attr('color', hasCallout ? 'teal lighten-2' : 'grey');
    el.tagName = 'v-alert';
    log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, before, $.html(el));
  });

};

module.exports = convertPanel;
