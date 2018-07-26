const actions = {

  setCurrentBackgroundImage({ commit, getters, state }, payload) { // preload/set a new background image
    commit('setImgLoading', true);
    let img = new Image();
    if (typeof payload === 'number') { // image index
      commit('setBgIndex', payload);
      let index = (payload < 1 ? 1 + Math.floor(Math.random() * (state.bgImages.length - 1)) : payload);
      img.src = getters.getBackgroundImages[index];
    } else { // image name
      img.src = payload;
    }
    img.onload = () => {
      commit('setCurrentBackgroundImage', img.src)
      commit('setImgLoading', false);
    };
  },

  setPreferences({ commit, dispatch }, payload) { // reload saved preferences {object} (see Preferences component)
    commit('setStoryLayout', payload.storyLayout)
    commit('setPostsPerPage', payload.postsPerPage)
    dispatch('setCurrentBackgroundImage', payload.bgImage)
  }

};

export default actions;