/**
 * Change label class to vuetify standard (v-chip)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertLabel = (story, $, log, commentIdx = -1) => {

  log.set('label');

  $('.label, span.blue, span.yellow').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    let color = '';
    if ($el.hasClass('red') || $el.hasClass('alert')) color = 'error'
    else if ($el.hasClass('blue') || $el.hasClass('info')) color = 'info'
    else if ($el.hasClass('green') || $el.hasClass('success')) color = 'success'
    else if ($el.hasClass('yellow') || $el.hasClass('warning')) color = 'warning'
    else color = 'grey';
    $el
      .removeClass('label red alert blue info green success yellow warning')
      .attr('color', color)
      .attr('text-color', 'white');
    if (el.tagName === 'span') { 
      $el.attr('small', '');
      $el.find('v-icon').each((index, icon) => { $(icon).attr('small', ''); });
    }
    if (!el.attribs.class.length) delete el.attribs.class;
    el.tagName = 'v-chip';
    log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, before, $.html(el));
  });

};

module.exports = convertLabel;
