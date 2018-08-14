/**
 * Append style defs for .neonhand class (handwriting text style)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertHandwriting = (story, $, log, commentIdx = -1) => {

  log.set('handwriting');

  if ($('.neonhand').length > 0) {
    $('div').eq(0).append(
`<style>
@import url('https://fonts.googleapis.com/css?family=Nothing+You+Could+Do');
.neonhand{font-family:'Nothing You Could Do',cursive; font-size:1.5em; line-height:1.5em;}
</style>
    `);
    
    log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, '.neonhand', 'Added font style definition');

  }

};  

  module.exports = convertHandwriting;
