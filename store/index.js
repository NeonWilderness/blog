import Vuex from 'vuex';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const Store = () => {
  return new Vuex.Store({
    state: {
      bgImage: '/img/px1.png',
      bgImages: [],
      bgIndex: -1,
      isDrawerVisible: false,
      isImgLoading: true,
      layouts: {
        single: { grid: 'xs12', columns: 1 },
        double: { grid: 'xs6', columns: 2 },
        triple: { grid: 'xs4', columns: 3 }
      },
      maxPage: 0,
      page: 0,
      posts: [],
      postsPerPage: 4,
      preferencesKey: 'preferences@NeonWilderness',
      storyLayout: 'single'
    },
    getters,
    actions,
    mutations
  })
};

export default Store;