const headingClasses = {
  h1: 'display-2',
  h2: 'display-1',
  h3: 'headline',
  h4: 'title',
  h5: 'subheading',
  h6: 'body-2',
};

/**
 * Change html headings to vuetify standard classes
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertHeading = (story, $, log, commentIdx = -1) => {

  log.set('heading');

  $('h1, h2, h3, h4, h5, h6').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    $el.addClass(`${headingClasses[el.tagName]} font-weight-light mb-2`);
    log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, before, $.html(el));
  });

};

module.exports = convertHeading;
