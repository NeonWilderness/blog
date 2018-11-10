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
  getBreadcrumbs: state => (homePage) => {
    if (homePage && !state.category.length) return;
    return state.breadcrumbs.slice(0, 1 + Number(!!state.category));
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
  getCounterByPostId: state => (id) => { // {string} id = post id
    for (let post of state.posts) {
      if (post._id === id) return post.counter;
    }
    throw new Error(`PostId: ${id} not found in posts.`);
  },
  getCredentialsKey: state => {
    return state.credentialsKey;
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
  getIndexOfBasename: state => (basename) => { // {string} basename = post basename
    for (let i = 0, len = state.posts.length; i < len; i++) {
      if (state.posts[i].basename === basename) return i;
    }
    return -1;
  },
  getLayoutGrid: state => {
    return state.layouts[state.storyLayout].grid;
  },
  getMost: state => (type) => { // {string} type = reads|hearts|comments
    return state.most[type][state.selectedPeriod];
  },
  getPostOlder: (state) => (postIndex) => { // {number} postIndex = index of post.basename
    return ((postIndex === state.posts.length - 1) || (postIndex < 0) ? '' : state.posts[postIndex + 1].basename);
  },
  getPostYounger: (state) => (postIndex) => { // {number} postIndex = index of post.basename
    return (postIndex < 1 ? '' : state.posts[postIndex - 1].basename);
  },
  getPostsPerPage: state => {
    return state.postsPerPage;
  },
  getPreferencesKey: state => {
    return state.preferencesKey;
  },
  getRememberGravatar: state => {
    return state.rememberGravatar;
  },
  getSortedComments: state => {
    return state.comments
    .filter(commentOrReply => !commentOrReply.parentid.length)
    .reduce((all, comment) => {
      all.push(comment);
      return all.concat(
        state.comments
          .filter(commentOrReply => commentOrReply.parentid === comment._id)
      );
    }, []);
  },
  getStoryStateKey: state => (type) => { // {string} type = reads|hearts
    return `story${type}@NeonWilderness`;
  },
  getStoriesReadKey: state => {
    return state.storiesreadKey;
  },
  getStoryLayout: state => {
    return state.storyLayout;
  },
  getTdCommentatorAlias: state => (author) => { // {string} author
    return (
      state.tdCommentators.hasOwnProperty(author) ? 
      `/img/icons/user/${state.tdCommentators[author]}.jpg` : 
      ''
    );
  },
  getThumbsImages: state => {
    return state.bgImages.map(img => {
      return `/img/bg/thumbs/${img}`;
    });
  },
  isCredentialChange: state => (email, name, url) => {
    return (
      email !== state.credentials.email || 
      name !== state.credentials.name || 
      url !== state.credentials.url
    );
  },
  isGoToTopButtonVisible: state => {
    return (state.scrollPosition > 500);
  },
  isSingleStoryLayout: state => {
    return (state.storyLayout === 'single');
  },
  isValidBasename: state => (basename) => { // {string} basename = a post's basename
    for (let post of state.posts) {
      if (post.basename === basename) return true;
    }
    return false;
  },
  isValidLayoutID: state => (storyLayout) => {
    return (Object.keys(state.layouts).indexOf(storyLayout) >= 0);
  },
  isVideoloadUsedInComments: state => {
    return state.comments.some(comment => comment.videoload);
  },
  wasLastCommentAutoApproved: state => {
    if (state.comments.length === 0) return false;
    let lastComment = state.comments[state.comments.length - 1];
    return lastComment.approved;
  }

};

export default getters;