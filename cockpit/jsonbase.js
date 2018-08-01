/**
 * Create underlying static JSON files as part of any dev/build/generate run
 * =========================================================================
 * 
 */
require('dotenv-safe').load();

const cheerio = require('cheerio');
const cockpit = require('./cockpit');
const ellipsize = require('ellipsize');
const fs = require('fs');
const path = require('path');

const mostRecentComments = 10;
const maxCommentAbstractLength = 87;

const log = (name, len) => {
  console.log(`${name}.json created with ${len} entries.`);
};

/**
 * Create JSON file of all available background images in folder static/img/bg/
 */

let backgrounds = fs.readdirSync(path.resolve(process.cwd(), 'static/img/bg/thumbs/')).sort();
fs.writeFileSync(
  path.resolve(process.cwd(), 'static/json/allBackgrounds.json'),
  JSON.stringify(backgrounds)
);
log('allBackgrounds', backgrounds.length);

/**
 * Create JSON files of all available posts and the 10 most recent comments
 * while also assemble allRoutes array of all available routes:
 * - index as '/',
 * - all posts as '/:basename',
 * - all categories as '/topic/:category
 */

// read all posts
cockpit.readPosts()
  .then((posts) => {

    // create allPosts.json
    fs.writeFileSync(
      path.resolve(process.cwd(), 'static/json/allPosts.json'),
      JSON.stringify(posts)
    );
    log('allPosts', posts.length);

    // create temporary reference hash: post._id ==> post.basename
    let xrefBasename = posts.reduce( (all, post) => {
      all[post._id] = post.basename;
      return all;
    }, {});

    // enhance allRoutes array with individual post routes, starting with index route
    let allRoutes = posts.reduce((all, post) => {
      all.push(`/${post.basename}/`);
      return all;
    }, ['/']);

    // read all categories
    return cockpit.readCategories({
      fields: { 'category': 1, 'count': 1, 'slug': 1 },
      filter: { slug: { $not: 'unveroeffentlicht' }}
    })
      .then((categories) => {

        // create allCategories.json
        fs.writeFileSync(
          path.resolve(process.cwd(), 'static/json/allCategories.json'),
          JSON.stringify(categories)
        );
        log('allCategories', categories.length);

        // enhance allRoutes array with category routes
        allRoutes = categories.reduce((all, category, index) => {
          all.push(`/topic/${category.slug}/`);
          return all;
        }, allRoutes);
        fs.writeFileSync(
          path.resolve(process.cwd(), 'static/json/allRoutes.json'),
          JSON.stringify(allRoutes)
        );
        log('allRoutes', allRoutes.length);

        // create mostRecentComments.json
        return cockpit.readComments({
          fields: { 'postid': 1, 'postdate': 1, 'author': 1, 'authorurl': 1, 'content': 1, 'parentid': 1 }
        })
          .then((comments) => {
            let mostRecent = comments.slice(0, mostRecentComments);
            mostRecent.forEach(comment => {
              let $ = cheerio.load(`<div>${comment.content}</div>`, { decodeEntities: false });
              comment.content = ellipsize($('div').text(), maxCommentAbstractLength);
              comment.basename = xrefBasename[comment.postid];
            });
            fs.writeFileSync(
              path.resolve(process.cwd(), 'static/json/mostRecentComments.json'),
              JSON.stringify(mostRecent)
            );
            log('mostRecentComments', mostRecent.length);
          });
      });
  });