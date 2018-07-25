import Vuex from 'vuex';

const Store = () => {
  return new Vuex.Store({
    state: {
      bgImage: '/img/px1.png',
      bgImages: [],
      bgIndex: -1,
      isDrawerVisible: false,
      preferencesKey: 'preferences@NeonWilderness',
      storyLayout: 'single'
    },
    getters: {
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
      },
    },
    mutations: {
      /**
       * Saves available background image names assembled from static/img/backgrounds.json during compile time
       * (see also nuxt.config.js)
       * @param {*} state 
       * @param {*} payload array of image names
       */
      setBackgroundImages(state, payload) {
        state.bgImages = payload;
      },
      /**
       * Sets the current background image
       * @param {*} state 
       * @param {number|string} payload number: 0=random image, >0=index of image, string: image path/name
       */
      setCurrentBackgroundImage(state, payload) {
        if (typeof payload === 'number') { // image index
          state.bgIndex = payload;
          let index = (payload < 1 ? 1 + Math.floor(Math.random() * (state.bgImages.length - 1)) : payload);
          state.bgImage = this.getters.getBackgroundImages[index];
        } else { // image name
          state.bgImage = payload;
        }
      },
      setStoryLayout(state, payload) { // updated story layout {string}
        state.storyLayout = payload;
      },
      toggleDrawer(state) {
        state.isDrawerVisible = !state.isDrawerVisible;
      }
    }
  })
}

export default Store;