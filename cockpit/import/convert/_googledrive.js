require('dotenv-safe').load();
const baseUrl = process.env.BASEURL.substr(process.env.BASEURL.indexOf('://') + 1);

const path = require('path');
const imageDir = `${baseUrl}/cockpit/storage/uploads/images/`;
/**
 * Remove old googledrive class and use direct image urls
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertGoogleDrive = (story, $, log, commentIdx = -1) => {

  log.set('googledrive');

  $('.googledrive').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    if (el.tagName === 'a')
      $el.attr('href', path.normalize(`${imageDir}${$el.attr('href')}`));
    else {
      let alt = $el.attr('alt');
      $el
        .attr('src', `${imageDir}${alt}`)
        .attr('width', '100%')
        .attr('alt', alt.split('/').pop());
    } 
    $el.removeClass('googledrive noadds th');
    if (!el.attribs.class.length) delete el.attribs.class;
    log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, before, $.html(el));
  });

};

module.exports = convertGoogleDrive;
