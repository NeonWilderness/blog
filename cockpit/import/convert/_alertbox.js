/**
 * Change foundation5 alert-box to vuetify standard (v-alert)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 */
const convertAlertbox = (story, $, log) => {

  $('.alert-box').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    if ($el.hasClass('alert')) $el.attr('color', 'error');
    $el
      .removeClass('alert-box alert')
      .addClass('radius')
      .attr(':value', 'true');
    el.tagName = 'v-alert';
    log.item(story.fm.basename, before, $.html(el));
  });

};

module.exports = convertAlertbox;
