<template>
  <div>
    <section class="hero"></section>
    <section class="content">
      <v-layout row wrap class="contentwrapper pt-2">
        <v-flex xs12 md8 lg7 offset-lg1 class="storywrapper">
          <Story :post="post" :comments="comments" view="full" />
        </v-flex>
        <v-flex xs12 md4 lg3 class="sidebar">
          <WeepingWillow />
          <Sonnet />
          <LuckyMan />
          <ThisTime />
        </v-flex>
      </v-layout>
    </section>
  </div>
</template>

<script>
import LuckyMan from '~/components/LuckyMan.vue';
import Sonnet from '~/components/Sonnet.vue';
import Story from '~/components/Story.vue';
import ThisTime from '~/components/ThisTime.vue';
import WeepingWillow from '~/components/WeepingWillow.vue';

export default {
  components: {
    LuckyMan,
    Sonnet,
    Story,
    ThisTime,
    WeepingWillow
  },
  data: function() {
    return {};
  },
  asyncData: function({ app, params, payload, store }) {

    const getPostComments = postid =>
      app.$cockpit.readComments({
        dump: false,
        filter: { postid },
        sort: { parentid: 1, postdate: 1 }
      });

    if (payload) {
      return getPostComments(payload._id).then(comments => {
        return { post: payload, comments };
      });
    } else {
      return store.dispatch('readPostBasename', {
        cockpit: app.$cockpit,
        params
      }).then(({post}) => {
        return getPostComments(post._id).then(comments => {
          return { post, comments };
        });
      });
    }
    
  },
  fetch({ store }) {
    if (store.state.posts.length > 0) return Promise.resolve();
    else
      return store
        .dispatch('establishCounterData')
        .then(() =>
          Promise.all([
            store.dispatch('loadCategories'),
            store.dispatch('loadMostRecentComments')
          ])
        )
        .catch(err => {
          console.log(`Fetch@_slug.vue ended with error: ${err}.`);
        });
  }
};
</script>

<style lang="less">
.content {
  color: #fff;
  margin-top: -5em;
  text-align: left;
}
.contentwrapper {
  background-color: rgba(33, 33, 33, 0.95);
  margin-bottom: 0 !important;
}
.hero {
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  .btnPreferences {
    background-color: #222;
    border-radius: 3px;
    color: #eaeaea;
    height: 48px;
    line-height: 48px;
    opacity: 0.9;
    padding: 0;
    position: fixed;
    right: -25px;
    text-align: center;
    top: 20%;
    transition: right 0.5s ease-in-out;
    width: 48px;
    z-index: 1;
    &:hover,
    &:focus {
      outline: none;
      right: -2px;
    }
  }
}
.storyfooter .v-toolbar__content {
  padding: 0 8px;
}
.storywrapper,
.sidebar {
  width: 100%;
}
</style>
