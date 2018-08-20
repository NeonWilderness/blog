const mutations = {

  establishCockpitInstance(state, payload) {
    state.cockpitApi = payload;
  },
  setBackgroundImages(state, payload) { // background image names assembled from /img/backgrounds.json during compile time
    state.bgImages = payload;
  },
  setBgIndex(state, payload) { // index of background image {number}
    state.bgIndex = payload;
  },
  setCategories(state, payload) { // array of categories {array} of { category, count, slug, _id }
    state.categories = payload;
  },
  setCounterData(state, {type, period, posts}) { // object { type, period, posts }
    state.most[type][period] = posts;
  },
  setCurrentBackgroundImage(state, payload) { // path/name of loaded background image {string}
    state.bgImage = payload;
  },
  setImgLoading(state, payload) { // TRUE=new background image is currently loading {boolean}
    state.isImgLoading = payload;
  },
  setMaxPage(state) {
    state.maxPage = Math.floor(Math.abs(state.posts.length - 1) / state.postsPerPage);
  },
  setMostRecentComments(state, payload) { // array of max. 10 comments {array}
    state.mostRecentComments = payload;
  },
  setPosts(state, payload) { // array of cockpit posts {array}
    state.posts = payload;
  },
  setPostsPerPage(state, payload) { // number of posts per blog page {number}
    state.postsPerPage = payload;
  },
  setStoryLayout(state, payload) { // layout of posts on the blog page {string}
    state.storyLayout = payload;
  },
  toggleDrawer(state) {
    state.isDrawerVisible = !state.isDrawerVisible;
  }

};

export default mutations;