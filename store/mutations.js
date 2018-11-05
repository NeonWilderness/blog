const mutations = {

  addNewComment(state, payload) { // comment {object}
    if (payload.approved) state.comments.push(payload);
  },
  establishCockpitInstance(state, payload) {
    state.cockpitApi = payload;
  },
  setBackgroundImages(state, payload) { // background image names assembled from static/img/bg during compile time
    state.bgImages = payload;
  },
  setBgIndex(state, payload) { // index of background image {number}
    state.bgIndex = payload;
  },
  setCategory(state, payload) { // category slug {string}
    if (payload !== state.category) {
      state.category = payload;
      state.breadcrumbs[1].text = state.categories[payload].category;
      state.breadcrumbs[1].slug = payload;
    }
  },
  setCategories(state, payload) { // array of categories {array} of { category, count, slug, _id }
    state.categories = payload;
  },
  setComments(state, payload) { // array of comments
    state.comments = payload.map(comment => { 
      comment.selected = false;
      comment.videoload = (comment.content.indexOf('html5video') >= 0);
      return comment;
    });
  },
  setCounterData(state, {type, period, posts}) { // object { type, period, posts }
    state.most[type][period] = posts;
  },
  setCredentials(state, payload) { // credentials object { email, name, url }
    state.credentials = payload;
  },
  setCurrentBackgroundImage(state, payload) { // path/name of loaded background image {string}
    state.bgImage = payload;
  },
  setImgLoading(state, payload) { // TRUE=new background image is currently loading {boolean}
    state.isImgLoading = payload;
  },
  setMaxPage(state) {
    let counter = (
      state.category.length ?
      state.posts.reduce((all, post) => all + Number(post.category.slug === state.category), 0) :
      state.posts.length
    );
    state.maxPage = Math.ceil(counter / state.postsPerPage);
  },
  setMostRecentComments(state, payload) { // array of max. 10 comments {array}
    state.mostRecentComments = payload;
  },
  setPage(state, payload) { // page {number}
    state.page = payload;
  },
  setPosts(state, payload) { // array of cockpit posts {array}
    for (let post of payload) {

      // add potentially missing counter fields and values
      let counter = Object.assign({ reads: '0', hearts: '0', comments: '0'}, post.counter || {});
      // and convert to numbers
      post.counter.reads = Number(counter.reads);
      post.counter.hearts = Number(counter.hearts);
      post.counter.comments = Number(counter.comments);

      // eliminate unwanted cockpit system fields
      Object.keys(post.category).forEach(prop => {
        if (prop[0] === '_') delete post.category[prop];
      });

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