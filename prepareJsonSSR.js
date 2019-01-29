const fs = require('fs');
const path = require('path');
const cockpit = require('./cockpit/cockpit');

/**
 * Create JSON file of all available background images in folder static/img/bg/thumbs
 */
function prepareBackgroundsJson() {
  const backgrounds = fs.readdirSync(path.resolve(process.cwd(), 'static/img/bg/thumbs/')).sort();
  fs.writeFileSync(
    path.resolve(process.cwd(), 'static/json/allBackgrounds.json'),
    JSON.stringify(backgrounds)
  );
  console.log('allBackgrounds.json created.\n');
}

/**
 * Create JSON file of all posts (counter data) to speed up "nuxt generate" process (SSR)
 */
async function preparePostsJson() {

  const posts = await cockpit.readPosts({
    dump: false,
    fields: { 'basename': 1, 'category': 1, 'counter': 1, 'date': 1, 'title': 1 }
  });
  fs.writeFileSync(
    path.resolve(process.cwd(), 'static/json/allPosts.json'),
    JSON.stringify(posts)
  );
  console.log('allPosts.json created.');

}

/**
 * Create JSON file of all recent comments to speed up "nuxt generate" process (SSR)
 */
async function prepareCommentsJson() {

  // must be the same as store value 'maxMostRecentComments'
  const maxMostRecentComments = 10;
  const comments = await cockpit.readComments({
    dump: false,
    fields: { 'postid': 1, 'postdate': 1, 'author': 1, 'authorurl': 1, 'email': 1, 'content': 1, 'parentid': 1 },
    limit: maxMostRecentComments,
    skip: 0
  });
  fs.writeFileSync(
    path.resolve(process.cwd(), 'static/json/recentComments.json'),
    JSON.stringify(comments)
  );
  console.log('recentComments.json created.');

}

Promise.all([preparePostsJson(), prepareCommentsJson()]).then( () => prepareBackgroundsJson());