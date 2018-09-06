const mutations = {

  establishCockpitInstance(state, payload) {
    state.cockpitApi = payload;
  },
  setBackgroundImages(state, payload) { // background image names assembled from static/img/bg during compile time
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
  setPage(state, payload) { // page {number}
    state.page = payload;
  },
  setPosts(state, payload) { // array of cockpit posts {array}
    for (let post of payload) {
      Object.keys(post.category).forEach(prop => {
        if (prop[0] === '_') delete post.category[prop];
      })
    }
    state.posts = payload;
  },
  setPostsPerPage(state, payload) { // number of posts per blog page {number}
    state.postsPerPage = payload;
  },
  setStoryLayout(state, payload) { // layout of posts on the blog page {string}
    state.storyLayout = payload;
  },
  setScrollPosition(state, payload) { // scrollTop {number}
    state.scrollPosition = payload;
  },
  toggleDrawer(state) {
    state.isDrawerVisible = !state.isDrawerVisible;
  }

};

export default mutations;