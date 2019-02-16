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
  }

};

export default getters;