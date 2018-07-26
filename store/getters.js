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
  getThumbsImages: state => {
    return state.bgImages.map(img => {
      return `/img/bg/thumbs/${img}`;
    });
  },
  isCurrentBackgroundImage: state => (img) => {
    return (state.bgImage === img.replace('thumbs/', ''));
  },
  getStoryLayout: state => {
    return state.storyLayout;
  }

};

export default getters;