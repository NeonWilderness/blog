/**
 * Import Twoday Export file into Cockpit SQLITE DB
 * ================================================
 * 
 */
const { argv } = require('yargs');
const fs = require('fs');
const path = require('path');

const { deleteCategories, importCategories } = require('./import/categories');

const readFrontmatter = (chunk) => {
  let fm = chunk.split('\n').reduce((all, line, index) => {
    let parts = line.split(': ');
    let key = parts[0].toLowerCase().replace(/\s/g, '');
    if (key.length) all[key] = parts.slice(1).join('');
    return all;
  }, {});
  let i = fm.basename.lastIndexOf('-');
  if (i >= 0) {
    fm.slug = fm.basename.substr(0, i);
    fm.id = fm.basename.substr(i + 1);
  }
  console.log(`Read basename: ${fm.basename}.`);
  return fm;
};

const readBody = (chunk) => {
  return chunk.substr(6); // 'BODY:\n'.length
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
        default: comment[parts[0].toLowerCase()] = parts.slice(1).join('');
      }
    }
    comment.body = lines.slice(4).join('\n');
    all.push(comment);
    return all;
  }, []);
};

var blog = (argv.blog || 'neonwilderness').toLowerCase();
var dir = path.resolve(process.cwd(), 'data');

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

  deleteCategories()
  .then(() => importCategories(stories))
  .then(result => console.log(`${result.length} entries added to "categories".`));
