/**
 * Change span-class code to vuetify standard (code)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertCode = (story, $, log, commentIdx = -1) => {

  log.set('fontsize');

  $('font').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    $el.removeAttr('size');
    el.tagName = 'small';
    log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, before, $.html(el));
  });

};

module.exports = convertCode;
