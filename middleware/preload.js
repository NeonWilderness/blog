export default function ({ store }) {
  if (store.state.posts.length > 0) 
    return Promise.resolve();
  else
    return store
      .dispatch('establishCounterData')
      .then(() =>
        Promise.all([
          store.dispatch('loadCategories'),
          store.dispatch('loadMostRecentComments')
        ])
      )
      .catch(err => {
        console.log(`middleware store preload ended with error: ${err}.`);
      });
}