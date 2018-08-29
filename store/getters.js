const getters = {

  getBackgroundImages: state => {
    return state.bgImages.map(img => {
      return `/img/bg/${img}`;
    });
  },
  getBasenameOfPostId: state => (id) => { // {string} id = post id
    for (let post of state.posts) {
      if (post._id === id) return post.basename;
    }
    throw new Error(`Comment PostId: ${id} not found in posts.`);
  },
  getBgIndex: state => {
    return state.bgIndex;
  },
  getCategories: state => {
    return Object.keys(state.categories)
      .map(slug => state.categories[slug])
      .sort((a, b) => {
        if (a.category < b.category) return -1;
        if (b.category < a.category) return +1;
        return 0;
      });
  },
  getCurrentBackgroundImage: state => {
    return state.bgImage;
  },
  getCurrentPage: state => {
    return state.page;
  },
  getCurrentPosts: state => {
    let startAt = (state.page - 1) * state.postsPerPage;
    let endAt = startAt + state.postsPerPage;
    return state.posts.slice(startAt, endAt);
  },
  getLayoutGrid: state => {
    return state.layouts[state.storyLayout].grid;
  },
  getMost: state => (type) => { // {string} type = reads|hearts|comments
    return state.most[type][state.selectedPeriod];
  },
  getPostsPerPage: state => {
    return state.postsPerPage;
  },
  getPreferencesKey: state => {
    return state.preferencesKey;
  },
  getStoryLayout: state => {
    return state.storyLayout;
  },
  getThumbsImages: state => {
    return state.bgImages.map(img => {
      return `/img/bg/thumbs/${img}`;
    });
  },
  isCurrentBackgroundImage: state => (img) => {
    return (state.bgImage === img.replace('thumbs/', ''));
  },
  isSingleStoryLayout: state => {
    return (state.storyLayout === 'single');
  },
  isValidLayoutID: state => (storyLayout) => {
    return (Object.keys(state.layouts).indexOf(storyLayout) >= 0);
  }

};

export default getters;