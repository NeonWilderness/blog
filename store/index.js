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
        single: { grid: 'xs12 sm12', columns: 1 },
        double: { grid: 'xs12 sm6', columns: 2 },
        triple: { grid: 'xs12 sm4', columns: 3 }
      },
      maxCommentAbstractLength: 57,
      maxPage: 0,
      maxPostsPerMost: 5,
      maxMostRecentComments: 10,
      maxStoryAbstractLength: 300,
      most: {
        reads: {},
        //hearts: {},
        comments: {}
      },
      mostRecentComments: [],
      page: 1,
      posts: [],
      postsPerPage: 4,
      preferencesKey: 'preferences@NeonWilderness',
      scrollPosition: 0,
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