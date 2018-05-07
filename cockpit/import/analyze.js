/**
 * Analyzes blog post content from movable type export file
 * 1. list used class names
 * 2. list used data-commands (knockout/foundation)
 * 3. list used story scripts
 */
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

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
  let commentators = {};
  let distribution = {};
  let mostread = [];
  stories.forEach((story, index) => {

    console.log(`Analyzing "${story.fm.basename}"`);
    let $ = cheerio.load(`<div>${story.body.content}</div>`);

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

    // consolidate all commentators
    story.comments.forEach((comment) => {
      if (comment.author in commentators)
        commentators[comment.author]++;
      else
        commentators[comment.author] = 1;
    });

    // consolidate monthly distribution
    let month = story.fm.date.substr(0, 7); // jjjj-mm
    if (month in distribution)
      distribution[month]++;
    else
      distribution[month] = 1;

    // consolidate mostread stories
    mostread.push({ id: story.fm.id, title: story.fm.title, reads: story.body.reads });

  });
  /*
    dumpStats(usedClasses, 'usedClasses');
    dumpStats(usedDataCommands, 'usedDataCommands');
    dumpStats(usedScripts, 'usedScripts');
    
  */

  let rankedCommentators = Object.keys(commentators).reduce((all, author, index) => {
    all.push({ author, count: commentators[author] });
    return all;
  }, []).sort((a, b) => { return b.count - a.count; });
  fs.writeFileSync(
    path.resolve(process.cwd(), 'data', 'commentators.json'),
    JSON.stringify(rankedCommentators)
  );

  let topReads = mostread
    .sort((a, b) => { return b.reads - a.reads; })
    .slice(0, 20);
  fs.writeFileSync(
    path.resolve(process.cwd(), 'data', 'mostreads.json'),
    JSON.stringify(topReads)
  );

  let storiesPerMonth = Object.keys(distribution).reduce((all, month, index) => {
    all.push({ month, count: distribution[month] });
    return all;
  }, []).sort((a, b) => {
    let ma = parseInt(a.month.replace('-', ''));
    let mb = parseInt(b.month.replace('-', ''));
    return ma - mb;
  });
  fs.writeFileSync(
    path.resolve(process.cwd(), 'data', 'storiespermonth.json'),
    JSON.stringify(storiesPerMonth)
  );

};

module.exports = {
  analyzeStories
};