<template>
  <div>
    <section class="hero">
      <h1>In a neon wilderness <span>coming soon...</span></h1>
      <h3>Redesigned.<br>Redefined.<br>Reborn.</h3>
      <button class="btnPreferences" title="Einstellungen" @click="openPreferences">
        <i class="fa fa-cog fa-spin fa-lg fa-fw"></i>
      </button>
    </section>
    <section class="content">
      <v-layout row wrap class="contentwrapper pt-2">
        <v-flex xs12 md7 offset-md1 class="storywrapper">
          <Story />
        </v-flex>
        <v-flex xs12 md3 class="sidebar">
          <Sidebox />
        </v-flex>
      </v-layout>
    </section>
    <Preferences />
  </div>
</template>

<script>
import Preferences from "~/components/Preferences.vue";
import Sidebox from "~/components/Sidebox.vue";
import Story from "~/components/Story.vue";

export default {
  components: {
    Preferences,
    Sidebox,
    Story
  },
  data: function() {
    return {
    };
  },
  methods: {
    openPreferences() {
      this.$store.commit('toggleDrawer');
    }
  }
};
</script>

<style lang="less">
.content {
  margin-top: -5em;
}
.contentwrapper {
  background-color: rgba(33,33,33,0.95);
  margin-bottom: 0!important;
}
.storywrapper, .sidebar {
  width: 100%;  
}
.hero {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  text-align: center;
  h1 {
    background: rgba(21, 21, 21, 0.6);
    color: #fff;
    font-family: "Oswald";
    font-size: 2.75rem;
    font-weight: normal;
    opacity: 0.8;
    padding: 0.5em;
    width: 100%;
    word-spacing: 0;
    span {
      display: inline-block;
      font-size: 0.6em;
      opacity: 0.6;
    }
  }
  h3 {
    position: absolute;
    background: rgba(255, 255, 255, 0.6);
    font-family: "Courgette";
    font-size: 1.6875rem;
    font-weight: 300;
    top: 56px;
    left: -140px;
    width: 500px;
    padding: 0.4em;
    color: #df0025;
    transform: rotate(-45deg);
  }
  .btnPreferences {
    background-color: #222;
    border-radius: 3px;
    color: #eaeaea;
    height: 48px;
    line-height: 48px;
    opacity: 0.9;
    padding: 0;
    position: absolute;
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
</style>
