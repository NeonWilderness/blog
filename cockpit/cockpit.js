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
    populate: 1,
    sort: { date: -1 }
  })
    .then(data => {
      //console.log(JSON.stringify(data,null,2));
      return data.entries;
    });
};

module.exports = {
  readPosts
};