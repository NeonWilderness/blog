<template>
  <div>
    <section class="hero"></section>
    <section class="content">
      <v-layout 
        row 
        wrap 
        class="contentwrapper pt-2"
        v-scroll="onScroll"
      >
        <v-flex xs12 md8 lg7 offset-lg1>
          <v-breadcrumbs class="py-2" divider="/" style="position:relative">
            <v-breadcrumbs-item
              v-for="(item, index) in $store.getters.getBreadcrumbs(false)"
              @click.stop="$store.dispatch('setCategory', item.slug)"
              :disabled="index > 0"
              href="/"
              :key="item.text"
              ripple
            >
              <v-icon>{{item.icon}}</v-icon>
              {{ item.text }}
            </v-breadcrumbs-item>        
          </v-breadcrumbs>
        </v-flex>
        <v-flex xs12 md8 lg7 offset-lg1 class="storywrapper">
          <Story :post="post" view="full" />
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
  head() {
    return {
      title: this.post.title,
      titleTemplate: '%s [In a neon wilderness]'
    }
  },
  middleware: ['preload'],
  validate({ params, query, store }) {
    return store.getters.isValidBasename(params.slug);
  },
  asyncData: function({ app, error, params, payload, store }) {
    // read comments of a specific post and save to store
    const getPostComments = postid =>
      app.$cockpit.readComments({
          dump: false,
          filter: { postid },
          sort: { parentid: 1, postdate: 1 }
        })
        .then(comments => store.commit('setComments', comments));

    store.commit('setDataReady', false);
    if (payload) {
      return getPostComments(payload._id)
        .then(() => {
          store.commit('setDataReady', true);
          return { post: payload };
        });
    } else {
      return store.dispatch('readPostBasename', {
          cockpit: app.$cockpit,
          params
        })
        .then(({ post }) => {
          if (!post) throw new Error();
          return getPostComments(post._id)
            .then(() => { 
              store.commit('setDataReady', true);
              return { post }; 
            });
        })
        .catch(e => {
          error({ statusCode: 404, message: 'Basename nicht gefunden' });
        });
    }
  },
  methods: {
    getParentByClass(el, targetClass) {
      let target = el.parentNode;
      while (!(target.classList.contains(targetClass) || target.tagName === 'BODY')) {
        target = target.parentNode;
      }
      return target;
    },
    onScroll(e) {
      let offsetTop = window.pageYOffset || document.documentElement.scrollTop;
      this.$store.commit('setScrollPosition', offsetTop);
    }
  },
  mounted: function() {

    this.$nextTick(() => {

      let expansionItems = document.querySelectorAll('.storywrapper .v-expansion-panel__header');
      expansionItems.forEach(item => {
        item.addEventListener('click', e => {
          setTimeout(() => {
            // position opened v-expansion-panel to top of screen
            this.$vuetify.goTo(
              this.getParentByClass(e.target, 'v-expansion-panel'), 
              {duration:200, offset:-10}
            );
          }, 200);
        });
      });

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
  padding-bottom: 16px;
}
.storyfooter .v-toolbar__content {
  padding: 0 8px;
}
.storywrapper,
.sidebar {
  width: 100%;
}
</style>
