const sanitizePage = (page, maxPage) => {
  return (page < 0 ? 0 : (page > maxPage ? maxPage : page));
};

const mutations = {

  incPage(state, payload) { // -x page/s backward, +x page/s forward {number}
    state.page = sanitizePage(state.page + payload);
  },
  setBackgroundImages(state, payload) { // background image names assembled from /img/backgrounds.json during compile time
    state.bgImages = payload;
  },
  setBgIndex(state, payload) { // index of background image {number}
    state.bgIndex = payload;
  },
  setCurrentBackgroundImage(state, payload) { // path/name of loaded background image {string}
    state.bgImage = payload;
  },
  setImgLoading(state, payload) { // TRUE=new background image is currently loading {boolean}
    state.isImgLoading = payload;
  },
  setPage(state, payload) { // new page value {number}
    state.page = sanitizePage(payload);
  },
  setPosts(state, payload) { // array of cockpit posts {array}
    state.posts = payload;
    state.maxPage = Math.floor(Math.abs(payload.length - 1) / state.postsPerPage);
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
