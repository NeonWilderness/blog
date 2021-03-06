<template>
  <div>
    <section 
      class="hero"
      :style="{backgroundImage: 'url('+ $store.state.bgImage +')'}"
    >
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
          <v-breadcrumbs 
            class="py-2" 
            :items="$store.getters.getBreadcrumbs(true)" 
            style="position:relative"
          >
            <template slot="item" slot-scope="props">
              <li>
                <a
                  class="v-breadcrumbs__item" 
                  :class="{ 'v-breadcrumbs__item--disabled': props.item.disabled }"
                  @click.prevent.stop="$store.dispatch('setCategory', props.item.slug)"
                  href="/" 
                >  
                  <v-icon>{{props.item.icon}}</v-icon>
                  {{ props.item.text }}
                </a>
              </li>
            </template>
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
    <Preferences @adaptPostsPerPage="pageChange($store.state.page)" />
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
      return (this.$store.state.storyLayout === 'triple' ? 'lg9' : 'lg7 offset-lg1');
    }
  },
  watch: {
    currentCategory: function() {
      this.$store
        .dispatch('filterForCategory')
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
        .dispatch('readPostsSlice')
        .then(({ posts }) => {
          this.posts = posts;
        });
    }
  },
  middleware: ['preload'],  
  asyncData: function({ query, store }) {
    if (query.topic) {
      store.commit('setCategory', query.topic);
      return store.dispatch('filterForCategory');
    } else {
      return store.dispatch('readPostsSlice');
    }
  },
  mounted: function() {
    // update outdated SSR counter data and recent comments for static version only
    if (process.static && typeof this.$root.$options.context.from === 'undefined') {
      this.$store.dispatch('updatePostsCounter', this.posts);
      this.$store.dispatch('loadMostRecentComments');
    }
  }
};
</script>

<style lang="less">
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
.content {
  color: #fff;
  margin-top: -5em;
  text-align: left;
}
.contentwrapper {
  background-color: rgba(33, 33, 33, 0.95);
  margin-bottom: 0 !important;
}
.storyfooter .v-toolbar__content {
  padding: 0 8px;
}
.storywrapper,
.sidebar {
  width: 100%;
}
</style>
