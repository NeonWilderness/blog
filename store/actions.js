import CockpitApi from '~/cockpit/cockpitClient';
import ellipsize from 'ellipsize';
import innertext from 'innertext';
import { getCutoffDate, sortDescByCounterType } from './util';

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

const deriveAbstract = (html, abstractLength) => {
  let cleanup = removeUnwantedTags(html, ['style', 'v-chip', 'v-icon']);
  return ellipsize(innertext(cleanup), abstractLength);
};

const actions = {

  establishCounterData({ commit, state }) {
    return state.cockpitApi.readPosts({
      dump: false,
      fields: { 'basename': 1, 'category': 1, 'counter': 1, 'date': 1, 'title': 1 }
    }).then(posts => {

      commit('setPosts', posts);
      commit('setMaxPage');

      for (let period of state.selectPeriods) { // D90 | Y3 | F
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

  // payload = { type: 'reads'|'hearts'|'comments', id: 'postid', cockpit }
  incPostCounter({ getters }, { type, id, cockpit }) {
    let counter = getters.getCounterByPostId(id);
    counter[type]++;
    return cockpit.saveCollection('posts', {
      data: {
        _id: id,
        counter
      }
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
    return state.cockpitApi.readComments({
      dump: false,
      fields: { 'postid': 1, 'postdate': 1, 'author': 1, 'authorurl': 1, 'content': 1, 'parentid': 1 },
      limit: state.maxMostRecentComments,
      skip: 0
    }).then(comments => {

      commit('setMostRecentComments', comments.map(comment => {
        comment.content = ellipsize(innertext(comment.content), state.maxCommentAbstractLength);
        return {
          basename: getters.getBasenameOfPostId(comment.postid),
          ...comment
        };
      }));

    });
  },

  nuxtServerInit({ commit }, { app, env }) {
    const cockpitInstance = new CockpitApi({
      host: env.apiUrl || env.APIURL,
      token: env.apiKey || env.APIKEY,
      axios: app.$axios
    });
    commit('establishCockpitInstance', cockpitInstance);
  },

  readPostComments({ state }, { cockpit, postid }) { // payload = { cockpit, postid }

    return new Promise((resolve, reject) => {
      cockpit.readComments({
        dump: false,
        filter: { postid }
      }).then(comments => {
        resolve({ comments });
      }).catch(err => { reject(err); });
    });

  },

  readPostBasename({ state }, { cockpit, params }) { // payload = { cockpit, params }

    return new Promise((resolve, reject) => {
      cockpit.readPosts({
        dump: false,
        filter: { basename: params.slug }
      }).then(([post]) => {
        post.abstract = deriveAbstract(post.content, state.maxStoryAbstractLength);
        post.videoload = (post.content.indexOf('html5video') >= 0);
        if (typeof post.image !== 'object') {
          let img = post.content.match(/<img.*?src="(.*?)"/);
          if (img) post.image = {
            path: img[1].replace(
              /^\/cockpit\/storage\/uploads?/,
              `${state.cockpitApi.host}/storage/uploads`
            )
          }
        } else {
          post.image.path = `${state.cockpitApi.host}/storage/uploads${post.image.path}`;
        }
        resolve({ post });
      }).catch(err => { reject(err); });
    });

  },

  readPostsSlice({ state }, payload) { // payload = cockpit instance

    return new Promise((resolve, reject) => {
      payload.readPosts({
        dump: false,
        limit: state.postsPerPage,
        skip: (state.page - 1) * state.postsPerPage
      }).then(posts => {
        let refinedPosts = posts.map(post => {
          post.abstract = deriveAbstract(post.content, state.maxStoryAbstractLength);
          if (typeof post.image !== 'object') {
            let img = post.content.match(/<img.*?src="(.*?)"/);
            if (img) post.image = {
              path: img[1].replace(
                /^\/cockpit\/storage\/uploads?/,
                `${state.cockpitApi.host}/storage/uploads`
              )
            }
          } else {
            post.image.path = `${state.cockpitApi.host}/storage/uploads${post.image.path}`;
          }
          return post;
        });
        resolve({ posts: refinedPosts });
      }).catch(err => { reject(err); });
    });

  },

  saveComment({ dispatch }, { comment, cockpit }) {
    return cockpit.saveCollection('comments', { data: comment })
      .then( () => dispatch('incPostCounter', { type: 'comments', id: comment.postid, cockpit }))
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