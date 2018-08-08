/**
 * Convert blog post content from Twoday's non-HTML5-style to true HTML5
 */
const cheerio = require('cheerio');
const LogChanges = require('./convert/_log');

const conversionFunctions = [
  require('./convert/_classes'),
  require('./convert/_dataattributes'),
  require('./convert/_icon'),
  require('./convert/_button'),
  require('./convert/_tooltip'),
  require('./convert/_alertbox'),
  require('./convert/_panel'),
  require('./convert/_orbit'),
  require('./convert/_row'),
  require('./convert/_handwriting')
];

const convertStories = (stories) => {

  // init new log container
  const log = new LogChanges();
  let convertedStories = '';

  // create a lookup table story.id => story.basename
  let basenames = stories.reduce( (all, story, index) => {
    all[story.fm.id] = story.fm.basename;
    return all;
  },{});

  stories.forEach(story => {

    // replace urls/strings prior to framework transformations
    let content = require('./convert/_strings')(story, basenames, log);
    // convert story content to cheerio element
    let $ = cheerio.load(`<div>${content}</div>`, { decodeEntities: false });
    // sequentially run all defined conversion functions
    conversionFunctions.forEach( fn => {
      fn(story, $, log);
    });
    // change converted story content
    story.body.content = $('div').html();

    convertedStories += `\n===> ${story.fm.basename} <===\n${story.body.content}`;

  });

  log.dump(convertedStories);

};

module.exports = {
  convertStories
};