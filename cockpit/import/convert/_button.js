const convertClassToColor = ($el, remove, add) => {
  $el.removeClass(remove);
  $el.attr('color', add);
};

/**
 * Change foundation5 button to vuetify standard (v-btn)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 */
const convertButton = (story, $, log) => {

  $('.button', 'button').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    for (let cls of (el.attribs.class || '').split(' ')) {
      switch (cls) {
        case 'tiny':
        case 'small': 
          $el.removeClass(cls);
          $el.attr('small');
          break;
        case 'success': 
        case 'secondary': 
        case 'info':
          convertClassToColor(cls, cls);
          break;
        case 'alert': 
          convertClass(cls, 'error');
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
    $el.attr(':ripple', 'true');
    el.tagName = 'v-btn';
    log.item(story.fm.basename, before, $.html(el));
  });

};

module.exports = convertButton;
