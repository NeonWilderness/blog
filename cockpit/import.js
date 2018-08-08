/**
 * Import Twoday Export file into Cockpit SQLITE DB
 * ================================================
 * 
 */
const { argv } = require('yargs');
const CockpitApi = require('cockpit-sdk').default;
const fs = require('fs');
const path = require('path');

const { analyzeStories } = require('./import/analyze');
const { convertStories } = require('./import/convert');
const { deleteCategories, importCategories } = require('./import/categories');
const { deletePosts, importPosts } = require('./import/posts');
const { deleteComments, importComments } = require('./import/comments');

require('dotenv-safe').load();

const Cockpit = new CockpitApi({
  host: process.env.APIURL,
  accessToken: process.env.APIKEY
});

const readFrontmatter = (chunk) => {
  let fm = chunk.split('\n').reduce((all, line, index) => {
    let parts = line.split(': ');
    let key = parts[0].toLowerCase().replace(/\s/g, '');
    if (key.length) all[key] = parts.slice(1).join(': ');
    return all;
  }, {});
  fm.id = fm.basename.split('-').pop();
  console.log(`Read basename: ${fm.basename}.`);
  return fm;
};

const readBody = (chunk) => {
  let m = chunk.match(/\[#(\d+)]$/), reads = 0;
  if (m) {
    reads = parseInt(m[1]);
    chunk = chunk.substr(0, chunk.length - m[0].length);
  }
  return { content: chunk.substr(6), reads }; // 'BODY:\n'.length
};

const readComments = (chunks) => {
  return chunks.reduce((all, chunk, index) => {
    let lines = chunk.split('\n');
    let comment = { type: '?' };
    for (let i = 0; i < 4; i++) {
      let line = lines[i];
      let parts = line.split(': ');
      switch (parts[0]) {
        case 'COMMENT:':
        case 'REPLY:': comment.type = parts[0].charAt(0); break;
        default: comment[parts[0].toLowerCase()] = parts.slice(1).join(': ');
      }
    }
    comment.body = lines.slice(4).join('\n');
    all.push(comment);
    return all;
  }, []);
};

let dir = path.resolve(process.cwd(), 'data');
let file;
if (argv.file)
  file = `${dir}/${argv.file}.txt`;
else {
  file = fs.readdirSync(dir).reduce((all, filename, index) => {
    let ext = filename.split('.').pop();
    if (ext === 'txt') all = `${dir}/${filename}`;
    return all;
  }, '');
}

console.log(`Reading export file: ${file}.`);
let stories = fs.readFileSync(file)
  .toString()
  .split('\n-----\n--------\n')
  .reduce((all, story, index) => {
    if (story.trim().length) {
      let chunks = story.split('\n-----\n');
      all.push({
        fm: readFrontmatter(chunks[0]),
        body: readBody(chunks[1]),
        comments: readComments(chunks.slice(2))
      });
    }
    return all;
  }, []);

if (argv.convert) convertStories(stories);
  
if (argv.analyze) analyzeStories(stories);
  
if (argv.stop) return;

let lookupCategories = {};
let lookupPosts = {};
let limit = argv.limit || Number.MAX_SAFE_INTEGER;
if (argv.oldest) stories = stories.reverse();

deleteCategories(Cockpit)
  .then(() => importCategories(Cockpit, stories))
  .then(result => {
    console.log(`${result.length} entries added to "categories".`);
    result.reduce( (all, entry, index) => {
      all[entry.category] = entry._id;
      return all;
    }, lookupCategories);
    return deletePosts(Cockpit);
  })
  .then(() => importPosts(Cockpit, stories, lookupCategories, limit))
  .then((result) => {
    console.log(`${result.length} articles added to "posts".`);
    result.reduce( (all, entry, index) => {
      all[entry.basename] = entry._id;
      return all;
    }, lookupPosts);
    return deleteComments(Cockpit);
  })
  .then(() => {
    console.log('Now adding comments and replies...');
    return importComments(Cockpit, stories, lookupPosts, limit);
  })
  .then(() => {
    console.log(`Comments and replies added to collection "comments".`);
  })
  .catch((err) => {
    console.log(`Import ended with error: ${err}.`);
  });