/**
 * Change some classes to either vuetify standard or font awesome icon defs
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertClasses = (story, $, log, commentIdx = -1) => {

  log.set('classes');

  let classFixes = [
    { from: 'aligncenter', to: 'text-xs-center' },
    { from: 'alignright', to: 'text-xs-right' },
    { from: 'bottom0', to: 'mb-0' },
    { from: 'error', to: 'error white--text pa-2 radius' },
    { from: 'icon-2x', to: 'fa-2x' },
    { from: 'icon-quote-left', to: 'fa fa-quote-left' },
    { from: 'icon-rocket', to: 'fa fa-rocket' },
    { from: 'icon-th-list', to: 'fa fa-th-list' },
    { from: 'muted', to: '' },
    { from: 'neonrounded', to: 'v-chip ml-0 px-3 py-1' },
    { from: 'pricing-table', to: 'pricing-table ml-0' },
    { from: 'space', to: '' },
    { from: 'text-center', to: 'text-xs-center' },
    { from: 'text-right', to: 'text-xs-right' },
    { from: 'top20', to: 'mt-3' },
    { from: 'vtop', to: '' }
  ];

  for (let fix of classFixes) {
    $(`.${fix.from}`).each((index, el) => {
      let $el = $(el);
      let cls = el.attribs.class;
      $el.removeClass(fix.from);
      if (fix.to.length) $el.addClass(fix.to);
      log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, cls, el.attribs.class);
    });
  }
  
};

module.exports = convertClasses;
