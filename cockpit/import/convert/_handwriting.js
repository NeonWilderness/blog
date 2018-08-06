/**
 * Append style defs for .neonhand class (handwriting text style)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 */
const convertHandwriting = (story, $, log) => {

  if ($('.neonhand').length > 0) {
    $('div').eq(0).append(`
      <style>
      @import url('https://fonts.googleapis.com/css?family=Nothing+You+Could+Do');
      .neonhand{font-family:'Nothing You Could Do',cursive; font-size:1.5em; line-height:1.5em;}
      </style>
    `);
    
    log.item(story.fm.basename, '.neonhand', 'Added font style definition');

  }

};  

  module.exports = convertHandwriting;
