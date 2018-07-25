import Vuex from 'vuex';

const Store = () => {
  return new Vuex.Store({
    state: {
      bgImage: '/img/px1.png',
      bgImages: [],
      isDrawerVisible: false
    },
    getters: {
      getBackgroundImages: state => {
        return state.bgImages.map( img => {
          return `/img/bg/${img}`;
        });
      },
      getCurrentBackgroundImage: state => {
        return state.bgImage;
      },
      isCurrentBackgroundImage: state => (img) => {
        return (state.bgImage === img);
      }
    },
    mutations: {
      setBackgroundImages(state, payload) { // array of image names
        state.bgImages = payload;
      },
      setCurrentBackgroundImage(state, payload) { // index of random/chosen image from available background images
        state.bgImage = this.getters.getBackgroundImages[payload];
      },
      toggleDrawer (state) {
        state.isDrawerVisible = !state.isDrawerVisible;
      }
    }
  })
}

export default Store;