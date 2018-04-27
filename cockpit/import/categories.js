/**
 * Manages deletion and import of blog post categories
 */
const { truncateCollection } = require('./shared');

const deleteCategories = (cockpit) => {
  return truncateCollection(cockpit, 'categories');
};

const importCategories = (cockpit, stories) => {

  let categories = stories.reduce((all, story, index) => {
    if (story.fm.category in all)
      all[story.fm.category]++;
    else
      all[story.fm.category] = 1;
    return all;
  }, {});

  let entries = Object.keys(categories)
    .sort()
    .reduce((all, category, index) => {
      all.push(cockpit.collectionSave('categories', { category, count: categories[category] }));
      return all;
    }, []);

  return Promise.all(entries);

};

module.exports = {
  deleteCategories,
  importCategories
};