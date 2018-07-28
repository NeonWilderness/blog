const getters = {

  getBackgroundImages: state => {
    return state.bgImages.map(img => {
      return `/img/bg/${img}`;
    });
  },
  getBgIndex: state => {
    return state.bgIndex;
  },
  getCurrentBackgroundImage: state => {
    return state.bgImage;
  },
  getCurrentPage: state => {
    return state.page;
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
  isValidLayoutID: state => (storyLayout) => {
    return (Object.keys(state.layouts).indexOf(storyLayout) >= 0);
  }

};

export default getters;