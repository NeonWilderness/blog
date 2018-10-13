/**
 * Inline <style>...</style> html to element's style="..."
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertStyle = (story, $, log, commentIdx = -1) => {

  log.set('inline-style');

  // for each inline <style> element
  $('style').each((i, el) => {
    let applied = '';
    let $el = $(el);
    let before = $.html(el);
    // get the rules content, remove any line breaks and split by ending rule bracket
    let parseRules = $el.html().replace(/\n/g, '').split('}');
    // for each rule
    parseRules.forEach(rule => {
      // split again by starting bracket
      let parts = rule.replace('<br/>', '').split('{');
      if (parts.length < 2) return;
      if (parts[0].indexOf(':hover') >= 0) return;
      // and cleanup isolated parts
      let selector = parts[0].trim();
      let style = parts[1].trim();
      applied += `selector(${selector}) => style(${style})\n`;
      // find related selectors and add/inject the element's style
      $(selector).each((j, target) => {
        let $target = $(target);
        let s = $target.attr('style') || '';
        $target.attr('style', `${s.trim()}${style}`);
      });
    });
    // finally remove the <style> element
    $el.remove();

    log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, before, applied);
  });

};

module.exports = convertStyle;
