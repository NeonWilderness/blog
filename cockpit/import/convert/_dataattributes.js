/**
 * Change data-commands, previously hidden in the title text to now be a valid data-attribute
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertDataAttributes = (story, $, log, commentIdx = -1) => {

  log.set('data-attributes');

  $('[title^="data-"]').each((i, el) => {
    let $el = $(el);
    let oldTitle = $el.attr('title');
    $el.removeAttr('title');
    oldTitle.split('|').forEach((cmd) => {
      cmd = cmd.trim();
      let i = cmd.indexOf('=');
      if (i >= 0) {
        let attr = cmd.substr(0, i).replace('data-!', '');
        let val = cmd.substr(i + 1);
        $el.attr(attr, val);
      } else {
        $el.attr(cmd, '');
      }
    });

    log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, oldTitle, Object.keys(el.attribs).reduce((all, attr) => {
      let val = $el.attr(attr);
      all += `${attr}${val.length ? '="' + val + '"' : ''} `;
      return all;
    }, ''));

  });

};

module.exports = convertDataAttributes;
