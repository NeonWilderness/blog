<template>
  <div>
    <section class="hero">
      <button class="btnPreferences" title="Einstellungen" @click="openPreferences">
        <i class="fa fa-cog fa-spin fa-lg fa-fw"></i>
      </button>
    </section>
    <section class="content">
      <v-layout 
        row 
        wrap 
        class="contentwrapper pt-2"
        v-scroll="onScroll"
      >
        <v-flex xs12 md8 lg7 offset-lg1 v-if="$store.state.category.length">
          <v-breadcrumbs class="py-2" divider="/" style="position:relative">
            <v-breadcrumbs-item
              @click="$store.dispatch('setCategory', item.slug)"
              v-for="(item, index) in $store.getters.getBreadcrumbs"
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
        <v-flex xs12 md8 :class="'storywrapper ' + largeSpaceClass">
          <v-layout row wrap>
            <v-flex 
              v-for="n in posts.length"
              :key="n" 
              :class="$store.getters.getLayoutGrid"
            >
              <Story :post="posts[n - 1]" view="grid" />
            </v-flex>
          </v-layout>
          <div class="text-xs-center">
            <v-pagination
              color="teal lighten-1"
              :length="$store.state.maxPage"
              total-visible="7"
              :value="$store.state.page"
              @input="pageChange"
            ></v-pagination>
          </div>      
        </v-flex>
        <v-flex xs12 md4 lg3 class="sidebar">
          <WeepingWillow />
          <Sonnet />
          <LuckyMan />
          <ThisTime />
        </v-flex>
      </v-layout>
    </section>
    <Preferences />
  </div>
</template>

<script>
import LuckyMan from '~/components/LuckyMan.vue';
import Preferences from '~/components/Preferences.vue';
import Sonnet from '~/components/Sonnet.vue';
import Story from '~/components/Story.vue';
import ThisTime from '~/components/ThisTime.vue';
import WeepingWillow from '~/components/WeepingWillow.vue';

export default {
  components: {
    LuckyMan,
    Preferences,
    Sonnet,
    Story,
    ThisTime,
    WeepingWillow
  },
  data: function() {
    return {};
  },
  computed: {
    currentCategory: function() {
      return this.$store.state.category;
    },
    largeSpaceClass: function() {
      return (this.$store.getters.getStoryLayout === 'triple' ? 'lg9' : 'lg7 offset-lg1');
    }
  },
  watch: {
    currentCategory: function() {
      this.$store
        .dispatch('filterForCategory', this.$cockpit)
        .then(({ posts }) => {
          this.posts = posts;
        });
    }
  },
  methods: {
    goToTop: function() {
      let el = document.getElementById('wrapper');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    onScroll(e) {
      let offsetTop = window.pageYOffset || document.documentElement.scrollTop;
      this.$store.commit('setScrollPosition', offsetTop);
    },
    openPreferences() {
      this.goToTop();
      this.$store.commit('toggleDrawer');
    },
    pageChange(newPage) {
      this.$store.commit('setPage', newPage);
      return this.$store
        .dispatch('readPostsSlice', this.$cockpit)
        .then(({ posts }) => {
          this.posts = posts;
        });
    }
  },
  asyncData: function({ app, store }) {
    return store.dispatch('readPostsSlice', app.$cockpit);
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
          console.log(`fetch@index.vue ended with error: ${err}.`);
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
.v-breadcrumbs li .v-icon {
  color: #757575;
  line-height: 1.1;
  margin-right: .5rem;
}
.v-breadcrumbs__divider {
  color: #f04124!important;
}
.v-breadcrumbs__item {
  color: #BDBDBD;
  font-size: .8rem;
  &:hover {
    color: #f04124;
  }
}
.v-breadcrumbs__item--disabled {
  color: #757575!important;
}
</style>
