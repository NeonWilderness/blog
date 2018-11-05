const cockpit = require('./cockpit/cockpit');

module.exports = () => {
  // assemble dynamic post routes (including payload)
  return cockpit.readPosts()
    .then(posts => {
      return posts.map(post => {
        return {
          route: `/${post.basename}`,
          payload: post
        };
      });
    });
};