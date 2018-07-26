/**
 * Read Cockpit CMS data for nuxt blog generation
 * ==============================================
 * 
 */
require('dotenv-safe').load();
const CockpitApi = require('cockpit-sdk').default;

const Cockpit = new CockpitApi({
  host: process.env.APIURL,
  accessToken: process.env.APIKEY
});

const readPosts = () => {
  return Cockpit.collectionGet('posts', {
    filter: { published: true },
    sort: { date: -1 }
  })
    .then(data => {
      return data.entries;
    });
};

module.exports = {
  readPosts
};