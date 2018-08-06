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
      categories: [],
      cockpitApi: null,
      firstStoryDate: '2006-10-24 03:16',
      isDrawerVisible: false,
      isImgLoading: true,
      layouts: {
        single: { grid: 'xs12', columns: 1 },
        double: { grid: 'xs6', columns: 2 },
        triple: { grid: 'xs4', columns: 3 }
      },
      maxPage: 0,
      maxPostsPerMost: 5,
      most: {
        reads: {},
        //hearts: {},
        comments: {}
      },
      mostRecentComments: [],
      page: 0,
      posts: [],
      postsPerPage: 4,
      preferencesKey: 'preferences@NeonWilderness',
      selectPeriods: [
        { text: '90 Tage', value: 'D90' },  // last 90 days
        { text: '3 Jahre', value: 'Y3' },   // last 3 years
        { text: 'vollständig', value: 'F' } // Full
      ],
      selectedPeriod: 'F',
      storyLayout: 'single'
    },
    getters,
    actions,
    mutations
  })
};

export default Store;