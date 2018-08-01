/**
 * Analyzes blog post content from Twoday's movable type export file
 * 1. list used class names
 * 2. list used data-commands (knockout/foundation)
 * 3. list used story scripts
 */
const cheerio = require('cheerio');

const dumpStats = (stats, header) => {
  console.log('='.repeat(header.length));
  console.log(`${header}`);
  console.log('='.repeat(header.length));
  Object.keys(stats).sort().forEach((key) => {
    console.log(`${key} (${stats[key]})`);
  });
};

const analyzeStories = (stories) => {

  let usedClasses = {};
  let usedDataCommands = {};
  let usedScripts = {};
  let skippedStories = [];
  let commentators = {};

  stories.forEach((story) => {

    console.log(`Analyzing "${story.fm.basename}"`);
    let $ = cheerio.load(`<div>${story.body.content}</div>`, { decodeEntities: false });

    // remember skipped stories
    if (story.fm.status === 'skip') skippedStories.push(story.fm.basename);

    // consolidate all used class names
    $('*').each((index, el) => {
      if ('class' in el.attribs) {
        for (cls of el.attribs.class.split(' ')) {
          cls = cls.trim();
          if (cls in usedClasses)
            usedClasses[cls]++;
          else
            usedClasses[cls] = 1;
        };
      }
    });

    // consolidate all used data-commands
    $('[title^="data-"]').each((i, el) => {
      $(el).attr('title').split('|').forEach((cmd) => {
        cmd = cmd.trim();
        let endOfCmd = cmd.indexOf('=');
        if (endOfCmd >= 0) cmd = cmd.substr(0, endOfCmd);
        if (cmd in usedDataCommands)
          usedDataCommands[cmd]++;
        else
          usedDataCommands[cmd] = 1;
      });
    });

    // consolidate all used story scripts
    $('.storyScript').each((index, el) => {
      let script = $(el).attr('href');
      if (script in usedScripts)
        usedScripts[script]++;
      else
        usedScripts[script] = 1;
    });

    story.comments.forEach( comment => {
      let author = comment.author.trim();
      if (!commentators.hasOwnProperty(author))
        commentators[author] = comment.url.trim().toLowerCase();
    });

  });
/*
  dumpStats(usedClasses, 'usedClasses');
  dumpStats(usedDataCommands, 'usedDataCommands');
  dumpStats(usedScripts, 'usedScripts');
  console.log('!! Skipped Stories:', skippedStories.join(', '));
*/
  let sortedCommentators =  Object.keys(commentators).sort();
  sortedCommentators.forEach(commentator => {
    console.log(commentator, commentators[commentator]);
  });
  console.log(`Found ${sortedCommentators.length} commentators.`);

};

module.exports = {
  analyzeStories
};