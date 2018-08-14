/**
 * Change font-awesome icons to vuetify standard (v-icon)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertIcon = (story, $, log, commentIdx = -1) => {

  log.set('icon');

  $('i.fa').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    let faClasses = [];
    let remainingClasses = [];
    for (let cls of el.attribs.class.split(' ')) {
      if (cls.substr(0,3) === 'fa-' ) faClasses.push(cls);
      else if (cls.substr(0,2) !== 'fa' ) remainingClasses.push(cls);
    }
    $el.text(faClasses.join(' '));
    if (remainingClasses.length)
      el.attribs.class = remainingClasses.join(' ');
    else
      delete el.attribs.class;  
    el.tagName = 'v-icon';
    log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, before, $.html(el));
  });

};

module.exports = convertIcon;
