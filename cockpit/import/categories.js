/**
 * Manages deletion and import of blog post categories
 */
const { delayNextPromise, truncateCollection } = require('./shared');

const deleteCategories = (Cockpit) => {
  return truncateCollection(Cockpit, 'categories');
};

const importCategories = (Cockpit, stories) => {
  const wait = 20; // ms
  let timeout = 0; // wait*index

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
      timeout += wait;
      all.push(delayNextPromise(timeout).then(() => Cockpit.collectionSave('categories', { category, count: categories[category] })));
      return all;
    }, []);

  return Promise.all(entries);

};

module.exports = {
  deleteCategories,
  importCategories
};