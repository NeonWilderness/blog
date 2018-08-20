<template>
  <div>
    <section class="hero">
      <button class="btnPreferences" title="Einstellungen" @click="openPreferences">
        <i class="fa fa-cog fa-spin fa-lg fa-fw"></i>
      </button>
    </section>
    <section class="content">
      <v-layout row wrap class="contentwrapper pt-2">
        <v-flex xs12 md8 lg7 offset-lg1 class="storywrapper">
          <v-layout row wrap>
            <v-flex 
              v-for="n in $store.getters.getPostsPerPage"
              :key="n" 
              :class="$store.getters.getLayoutGrid"
            >
              <Story :index="n" />
            </v-flex>
          </v-layout>
          <div class="text-xs-center">
            <v-pagination
              v-model="$store.state.page"
              color="teal lighten-1"
              :length="$store.state.maxPage"
              total-visible="7"
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
  methods: {
    openPreferences() {
      this.$store.commit('toggleDrawer');
    }
  },
  fetch({ store }) {
    return Promise.all([
      store.dispatch('establishCounterData').then(() => store.dispatch('loadCategories')),
      store.dispatch('loadMostRecentComments')
    ]);
  }
};
</script>

<style lang="less">
.content {
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
