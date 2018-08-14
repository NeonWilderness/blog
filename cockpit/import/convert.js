/**
 * Convert blog post content from Twoday's non-HTML5-style to true HTML5
 */
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const LogChanges = require('./convert/_log');

const conversionFunctions = [
  require('./convert/_classes'),
  require('./convert/_dataattributes'),
  require('./convert/_headings'),
  require('./convert/_code'),
  require('./convert/_number'),
  require('./convert/_icon'),
  require('./convert/_label'),
  require('./convert/_googledrive'),
  require('./convert/_button'),
  require('./convert/_tooltip'),
  require('./convert/_alertbox'),
  require('./convert/_panel'),
  require('./convert/_orbit'),
  require('./convert/_row'),
  require('./convert/_expansionpanel'),
  require('./convert/_handwriting')
];

const convertStories = (stories) => {

  // init new log container
  const log = new LogChanges();
  let convertedStories = '';

  const authors = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'data', 'authors.json')))
    .reduce((all, item) => {
      all[item.author] = item.url;
      return all;
    }, {});

  // create a lookup table story.id => story.basename
  const basenames = stories.reduce((all, story, index) => {
    all[story.fm.id] = story.fm.basename;
    return all;
  }, {});

  stories.forEach(story => {

    console.log(`Converting "${story.fm.basename}, ${story.comments.length} comments"`);

    // replace story/comment author urls with new blog location if available
    require('./convert/_authorurl')(story, authors);

    // replace urls/strings prior to framework transformations
    let content = require('./convert/_strings')(story, basenames, log);

    // convert story content to cheerio element
    let $ = cheerio.load(`<div>${content}</div>`, { xmlMode: true, decodeEntities: false });
    // sequentially run all defined conversion functions
    conversionFunctions.forEach(fn => {
      fn(story, $, log);
    });
    // change converted story content
    story.body.content = $('div').html();

    // convert story comments 
    story.comments.forEach((comment, index) => {
      let $ = cheerio.load(`<div>${comment.body}</div>`, { xmlMode: true, decodeEntities: false });
      // sequentially run all defined conversion functions
      conversionFunctions.forEach(fn => {
        fn(story, $, log, index+1);
      });
      // change converted comment
      comment.body = $('div').html();

    });

    convertedStories += `\n===> ${story.fm.basename} <===\n${story.body.content}`;

  });

  log.dump(convertedStories);

};

module.exports = {
  convertStories
};