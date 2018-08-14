/**
 * Change foundation5 button to vuetify standard (v-btn)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertButton = (story, $, log, commentIdx = -1) => {

  log.set('button');

  $('.button, button').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    for (let cls of (el.attribs.class || '').split(' ')) {
      switch (cls) {
        case 'tiny':
        case 'small': 
          $el.removeClass(cls).attr('small');
          break;
        case 'success': 
        case 'secondary': 
        case 'info':
          $el.removeClass(cls).attr('color', cls);
          break;
        case 'alert': 
          $el.removeClass(cls).attr('color', 'error');
          break;
        case 'radius': 
          $el.removeClass(cls);
          break;
        case 'round': 
          $el.removeClass(cls);
          $el.attr('round', '');
          break;
      }
    }
    $el.removeClass('button').attr(':ripple', 'true');
    if (!el.attribs.class.length) delete el.attribs.class;
    if ('title' in el.attribs && !el.attribs.title.length) delete el.attribs.title;
    el.tagName = 'v-btn';
    log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, before, $.html(el));
  });

};

module.exports = convertButton;
