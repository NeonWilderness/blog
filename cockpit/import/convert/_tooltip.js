/**
 * Change tipsy/foundation5 tooltip (a/span-tag) to vuetify standard (v-tooltip)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 */
const convertTooltip = (story, $, log) => {

  $('a.tip', '.has-tip').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    let tooltiptext = $el.attr('title');
    let innertext = $el.html();
    $el.removeClass('tip has-tip')
      .removeAttr('data-tooltip')
      .removeAttr('rel')
      .attr('top', '');
    el.tagName = 'v-tooltip';
    $el.html(`
      <span slot="activator" class="tooltip">${innertext}</span>
      <span>${tooltiptext}</span>
    `);
    log.item(story.fm.basename, before, $.html(el));
  });

};

module.exports = convertTooltip;
