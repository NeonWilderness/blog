const cockpit = require('./cockpit/cockpit');

module.exports = () => {
  let allRoutes, allPosts;
  // assemble all individual post routes (including payload)
  return cockpit.readPosts()
    .then(posts => {
      allPosts = posts;
      allRoutes = posts.map(post => {
        return {
          route: `/${post.basename}`,
          payload: post
        };
      });
      return cockpit.readCategories({
        dump: false,
        fields: { slug: 1 },
        filter: { slug: { $not: 'unveroeffentlicht' } }
      });
    })
    // add all individual category routes (including payload)
    .then(categories => {
      return allRoutes.concat(categories.map(category => {
        return {
          route: `/?topic=${category.slug}`,
          payload: allPosts.filter(post => post.category.slug === category.slug)
        };
      }))
    });
};