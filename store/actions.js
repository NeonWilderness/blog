import ellipsize from 'ellipsize';
import innertext from 'innertext';
import { getCutoffDate, sortDescByCounterType } from './util';

/**
 * Removes unwanted HTML tags to enable plain text abstract
 * @param {string} html HTML string to be processed
 * @param {array} tags Array of tags (string) to be removed
 * @returns {string} polished HTML string
 */
const removeUnwantedTags = (html, tags) => {
  let startsAt, endsAt;
  for (let tag of tags) {
    startsAt = html.indexOf(`<${tag}`);
    while (startsAt >= 0) {
      endsAt = html.indexOf(`</${tag}>`, startsAt + tag.length + 2);
      if (endsAt < 0) throw new Error(`Missing closing tag in story html: ${html}.`);
      html = `${html.substr(0, startsAt)}${html.substr(endsAt + tag.length + 3)}`;
      startsAt = html.indexOf(`<${tag}`);
    }
  }
  return html;
};

/**
 * 
 * @param {string} html HTML string to generate an abstract from
 * @param {number} abstractLength Desired character length of abstract
 * @returns {string} Abstract of a given html story
 */
const deriveAbstract = (html, abstractLength) => {
  let cleanup = removeUnwantedTags(html, ['style', 'v-chip', 'v-icon']);
  return ellipsize(innertext(cleanup), abstractLength);
};

/**
 * Store Actions, receive
 * - 1st: context = { state, rootState, commit, dispatch, getters, rootGetters }
 * - 2nd: payload if any 
 */
const actions = {

  establishCounterData({ commit, state }) {

    /**
     * Returns post counter data depending on call mode
     * server side: return pre-compiled JSON
     * client side: return current database data
     */
    const getCounterData = (cockpit) => {
      if (process.server)
        return Promise.resolve(require('../static/json/allPosts.json'));
      else
        return cockpit.readPosts({
          dump: false,
          fields: { 'basename': 1, 'category': 1, 'counter': 1, 'date': 1, 'title': 1 }
        });
    };
    
    return getCounterData(this.$cockpit).then(posts => {

      commit('setPosts', posts);
      commit('setMaxPage');

      for (let period of state.selectPeriods) { // period.value: D90 | Y3 | F
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

  filterForCategory({ commit, dispatch }) {
    commit('setPage', 1);
    commit('setMaxPage');
    return dispatch('readPostsSlice');
  },

  // payload = { type: 'reads'|'hearts'|'comments', id: 'postid', counter: {reads, hearts, comments} }
  incPostCounter({ state }, { type, id }) {

    return this.$cockpit.readCollection('posts', {
      dump: false,
      fields: { 'counter': 1 },
      filter: { _id: id }
    })
      .then(([post]) => {

        if (type === 'comments') 
          post.counter.comments = state.commentsTotal;
        else  
          post.counter[type]++;

        return this.$cockpit.saveCollection('posts', {
          data: {
            _id: id,
            counter: post.counter
          },
          dump: false
        }).then(() => post.counter);

      });

  },

  loadCategories({ commit, state }) {
    let categories = state.posts.reduce((all, post) => {
      if (post.category.slug in all)
        all[post.category.slug].count++;
      else
        all[post.category.slug] = {
          _id: post.category._id,
          category: post.category.category,
          count: 1,
          slug: post.category.slug
        };
      return all;
    }, {});
    commit('setCategories', categories);
  },

  loadMostRecentComments({ commit, state, getters }) {

    /**
     * Returns most recent blog comments depending on call mode
     * server side: return pre-compiled JSON
     * client side: return current database data
     */
    const getRecentComments = (cockpit) => {
      if (process.server)
        return Promise.resolve(require('../static/json/recentComments.json'));
      else
        return cockpit.readComments({
          dump: false,
          fields: { 'postid': 1, 'postdate': 1, 'author': 1, 'authorurl': 1, 'email': 1, 'content': 1, 'parentid': 1 },
          filter: { reviewed: true, approved: true },
          limit: state.maxMostRecentComments,
          skip: 0
        });
    };

    return getRecentComments(this.$cockpit).then(comments => {

      commit('setMostRecentComments', comments.map(comment => {
        comment.content = ellipsize(innertext(comment.content), state.maxCommentAbstractLength);
        return {
          basename: getters.getBasenameOfPostId(comment.postid),
          ...comment
        };
      }));

    })
    .catch(err => {
      console.log(`loadMostRecentComments Error: ${err}.`);
      commit('setMostRecentComments', []);
    });
  },

  readPostBasename({ state }, params) {

    return new Promise((resolve, reject) => {
      this.$cockpit.readPosts({
        dump: false,
        filter: { basename: params.slug }
      }).then(([post]) => {
        post.abstract = deriveAbstract(post.content, state.maxStoryAbstractLength);
        post.videoload = (post.content.indexOf('html5video') >= 0);
        post.content = post.content.replace(
          /src="\/cockpit\/storage\/uploads?/g,
          `src="${this.$cockpit.host}/storage/uploads`
        );
        if (post.image !== null && typeof post.image === 'object') {
          post.image.path = `${this.$cockpit.host}/storage/uploads${post.image.path}`;
        } else {
          let img = post.content.match(/<img.*?src="(.*?)"/);
          if (img) post.image = { path: img[1] };
        }
        resolve({ post });
      }).catch(err => { reject(err); });
    });

  },

  readPostComments({commit}, postid) {
    return this.$cockpit.readComments({
      dump: false,
      filter: { postid },
      sort: { parentid: 1, postdate: 1 }
    })
    .then(comments => commit('setComments', comments));
  },

  readPostsSlice({ state }) {

    let options = {
      dump: false,
      limit: state.postsPerPage,
      skip: (state.page - 1) * state.postsPerPage
    };

    if (state.category.length) 
      options.filter = { 'category': state.categories[state.category].category };

    return new Promise((resolve, reject) => {
      this.$cockpit.readPosts(options).then(posts => {

        let refinedPosts = posts.map(post => {
          post.abstract = deriveAbstract(post.content, state.maxStoryAbstractLength);
          if (post.image !== null && typeof post.image === 'object') {
            post.image.path = `${this.$cockpit.host}/storage/uploads${post.image.path}`;
          } else {
            let img = post.content.match(/<img.*?src="(.*?)"/);
            if (img) post.image = {
              path: img[1].replace(
                /^\/cockpit\/storage\/uploads?/,
                `${this.$cockpit.host}/storage/uploads`
              )
            }
          }
          return post;
        });

        resolve({ posts: refinedPosts });

      }).catch(err => { reject(err); });
    });

  },

  setCategory({ commit }, category) {
    commit('setCategory', category);
    commit('setPage', 1);
    commit('setMaxPage');
  },

  saveComment({ commit, dispatch }, comment) {
    return this.$cockpit.saveCollection('comments', { data: comment })
      .then(entry => {
        commit('setCommentAutoApproved', entry.data.approved);
        return dispatch('readPostComments', comment.postid);
      })
      .then(() => dispatch('incPostCounter', {type: 'comments', id: comment.postid}))
      .catch(err => console.log(`Sicherung Kommentar endete mit Fehler: ${err}.`));
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
    commit('setStoryLayout', payload.storyLayout);
    commit('setPostsPerPage', payload.postsPerPage);
    commit('setMaxPage');
    return dispatch('setCurrentBackgroundImage', payload.bgImage);
  }

};

export default actions;