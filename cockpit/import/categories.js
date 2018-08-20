/**
 * Manages deletion and import of blog post categories
 */
const { delayNextPromise, truncateCollection } = require('./shared');

const deleteCategories = (Cockpit) => {
  return truncateCollection(Cockpit, 'categories');
};

const importCategories = (Cockpit, stories) => {
  const wait = 120; // ms
  let timeout = 0; // wait*index

  let categories = stories.reduce((all, story, index) => {
    if (all.indexOf(story.fm.category) < 0)
      all.push(story.fm.category);
    return all;
  }, []);

  return Promise.all(
    categories
      .sort()
      .map(category => {
        timeout += wait;
        return delayNextPromise(timeout)
          .then(() => Cockpit.collectionSave('categories', { category }));
      })
    )

};

module.exports = {
  deleteCategories,
  importCategories
};