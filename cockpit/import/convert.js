/**
 * Convert blog post content from Twoday's non-HTML5-style to true HTML5
 */
const cheerio = require('cheerio');
const LogChanges = require('./convert/_log');

const conversionFunctions = [
  require('./convert/_classes'),
  require('./convert/_dataattributes'),
  require('./convert/_alertbox'),
  require('./convert/_icon'),
  require('./convert/_button'),
  require('./convert/_panel'),
  require('./convert/_orbit'),
  require('./convert/_tooltip'),
  require('./convert/_row'),
  require('./convert/_handwriting')
];

const convertStories = (stories) => {

  // init new log container
  const log = new LogChanges();

  stories.forEach(story => {
    // convert story content to cheerio element
    let $ = cheerio.load(`<div>${story.body.content}</div>`, { decodeEntities: false });
    // sequentially run all defined conversion functions
    conversionFunctions.forEach( fn => {
      fn(story, $, log);
    });
    // change converted story content
    story.body.content = $('div').html();

  });

  log.dump();

};

module.exports = {
  convertStories
};