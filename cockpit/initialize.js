/**
 * Initialize Cockpit SQLITE DB (truncate posts, categories, comments)
 * ===================================================================
 * 
 */
const CockpitApi = require('cockpit-sdk').default;

const { deleteCategories } = require('./import/categories');
const { deletePosts } = require('./import/posts');
const { deleteComments } = require('./import/comments');

require('dotenv-safe').load();

const Cockpit = new CockpitApi({
  host: process.env.APIURL,
  accessToken: process.env.APIKEY
});

deleteComments(Cockpit)
  .then(() => deletePosts(Cockpit))
  .then(() => deleteCategories(Cockpit))
  .then(() => console.log(`Cockpit DB initialized.`));