import CockpitApi from '../cockpit/cockpitClient';
import { getCutoffDate, sortDescByCounterType } from './util';

const actions = {

  establishCounterData({ commit, state }) {
    return state.cockpitApi.readPosts({
      dump: false,
      fields: { 'basename': 1, 'counter': 1, 'date': 1, 'title': 1 }
    }).then(posts => {
      // D90 | Y3 | F
      //debugger; // eslint-disable-line
      for (let period of state.selectPeriods) {
        let selectedPosts = [];
        let cutoffDate = getCutoffDate(period.value);
        let index = 0;
        while (index < posts.length && posts[index].date >= cutoffDate) {
          selectedPosts.push(posts[index]);
          index++;
        }
        Object.keys(state.most).forEach(counterType => {
          commit('setCounterData', {
            type: counterType,
            period: period.value,
            posts: sortDescByCounterType(selectedPosts, counterType).slice(0, state.maxPostsPerMost)
          });
        });
      }
    });
  },

  nuxtServerInit({ commit }, { app, env }) {
    console.log(`${process.server ? "server:" : "client:"}`, 'env:', JSON.stringify(env));
    let cockpitApi = new CockpitApi({
      host: env.apiUrl || env.APIURL,
      token: env.apiKey || env.APIKEY,
      axios: app.$axios
    });
    commit('establishCockpitInstance', cockpitApi)
  },

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