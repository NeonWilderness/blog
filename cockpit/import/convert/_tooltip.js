/**
 * Change tipsy/foundation5 tooltip (a/span-tag) to vuetify standard (v-tooltip)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertTooltip = (story, $, log, commentIdx = -1) => {

  log.set('tooltip');

  $('a.tip, .has-tip').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    let tooltiptext = $el.attr('title');
    let innertext = $el.html();
    $el.removeClass('tip has-tip')
      .removeAttr('aria-haspopup')
      .removeAttr('data-tooltip')
      .removeAttr('rel')
      .removeAttr('title')
      .attr('top', '');
    if (!el.attribs.class.length) delete el.attribs.class;  
    el.tagName = 'v-tooltip';
    $el.html(`
      <span slot="activator" class="tooltip">${innertext}</span>
      <span>${tooltiptext}</span>
    `);
    log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, before, $.html(el));
  });

};

module.exports = convertTooltip;
