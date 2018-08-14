/**
 * Change foundation5 alert-box to vuetify standard (v-alert)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertAlertbox = (story, $, log, commentIdx = -1) => {

  log.set('alertbox');

  $('.alert-box').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    if ($el.hasClass('alert')) $el.attr('color', 'error');
    $el
      .removeClass('alert-box alert')
      .addClass('radius')
      .attr(':value', 'true');
    el.tagName = 'v-alert';
    log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, before, $.html(el));
  });

};

module.exports = convertAlertbox;
