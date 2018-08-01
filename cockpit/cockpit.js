/**
 * Read Cockpit CMS data for nuxt blog generation
 * ==============================================
 * 
 */
const CockpitApi = require('cockpit-sdk').default;
const _merge = require('lodash.merge');

const Cockpit = new CockpitApi({
  host: process.env.apiUrl || process.env.APIURL,
  accessToken: process.env.apiKey || process.env.APIKEY
});

const readCollection = (collection, options) => {
  return Cockpit.collectionGet(collection, options)
  .then(data => {
    if ('dump' in options && options.dump) console.log(JSON.stringify(data, null, 2));
    return data.entries;
  })
  .catch(err => {
    console.log(`readCollection "${collection}" ended with error: ${err}`);
  });
};

const readPosts = (options) => {
  return readCollection('posts', _merge({
    filter: { published: true },
    populate: 0,
    sort: { date: -1 } // descending: newest on top
  }, options || {}));
};

const readCategories = (options) => {
  return readCollection('categories', _merge({
    filter: { count: true }, // make sure, count is not equal 0 (unused category)
    sort: { category: 1 } // ascending
  }, options || {}));
};

const readComments = (options) => {
  return readCollection('comments', _merge({
    filter: { reviewed: true, approved: true },
    sort: { postdate: -1 } // descending: newest on top
  }, options || {}));
};

module.exports = {
  readCategories,
  readComments,
  readPosts
};