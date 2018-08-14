/**
 * Change foundation5 grid classes row/columns to vuetify standard (v-container/v-layout/v-flex)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertRow = (story, $, log, commentIdx = -1) => {

  function processRowElement(el) {
    let $el = $(el);
    let before = $.html(el);
    let hasCollapse = $el.hasClass('collapse');
    let data = [];
    $el.find('>.columns').each((colx, col) => {
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
    log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, before, $.html(el));
  }

  log.set('row/columns');

  $('.row .row').each((index, el) => {
    processRowElement(el);
  });

  $('.row').each((index, el) => {
    processRowElement(el);
  });

};

module.exports = convertRow;
