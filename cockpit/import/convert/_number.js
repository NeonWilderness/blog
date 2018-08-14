/**
 * Change span-class redNumber to vuetify standard (v-btn + class=number)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertNumber = (story, $, log, commentIdx = -1) => {

  log.set('redNumber');

  $('.redNumber').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    $el
      .toggleClass('redNumber number left')
      .attr('fab', '')
      .attr('dark', '')
      .attr('color', 'red lighten-2')
    el.tagName = 'v-btn';
    log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, before, $.html(el));
  });

};

module.exports = convertNumber;
