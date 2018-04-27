const cockpitApi = require('cockpit-sdk').default;
require('dotenv-safe').load();

const cockpit = new cockpitApi({
  host: process.env.APIURL,
  accessToken: process.env.APIKEY
});

module.exports = (stories) => {

  let categories = stories.reduce( (all, story, index) => {
    if (story.fm.category in all) 
      all[story.fm.category]++;
    else
      all[story.fm.category] = 1;
    return all;    
  }, {});

  let entries = Object.keys(categories)
    .sort()
    .reduce( (all, category, index) => {
      all.push(cockpit.collectionSave("categories", { category, count: categories[category] }));
      return all;
    }, []);

  return Promise.all(entries);

};