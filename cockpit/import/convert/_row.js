/**
 * Change foundation5 orbit-container to vuetify standard (v-carousel)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 */
const convertRow = (story, $, log) => {

  log.set('row/columns');

  $('.row').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    let hasCollapse = $el.hasClass('collapse');
    let data = [];
    $el.find('.columns').each((colx, col) => {
      $col = $(col);
      $col.removeClass('columns');
      let cols = {}, newClass = [];
      for (let cls of (col.attribs.class || '').split(' ')) {
        let attrib = cls
          .replace('block-grid-', '')
          .replace('small-offset-', 'offset-xs')
          .replace('small-', 'xs')
          .replace('medium-', 'md');
        if (/(xs|md)\d+/.test(attrib)) 
          cols[attrib] = true;
        else 
          newClass.push(attrib); 
      }
      let classString = (newClass.length ? ` class="${newClass.join(' ')}"` : '');
      data.push(
       `<v-flex ${Object.keys(cols).join(' ')}${classString}>${$col.html()}</v-flex>
       `);
    });
    el.tagName = 'v-container';
    $el
      .removeClass('row collapse')
      .html(`<v-layout row d-flex>${data.join('')}</v-layout>`)
      .attr('fluid', '');
    if (!hasCollapse) $el.attr('grid-list-md', '');
    if (!el.attribs.class.length) delete el.attribs.class;
    log.item(story.fm.basename, before, $.html(el));
  });

};

module.exports = convertRow;
