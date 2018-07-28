<template>
  <v-app>
    <div id="wrapper" :class="{faded: $store.state.isImgLoading}" :style="{backgroundImage: 'url('+ $store.state.bgImage +')'}">
      <v-container fluid grid-list-md style="padding:0">
        <nuxt/>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import { escape } from 'escape-goat';

const prefDefaults = {
  bgImage: 0,
  postsPerPage: 4,
  storyLayout: 'single'
};

export default {
  data: function() {
    return {};
  },
  methods: {
    validatePreferences: function(prefs) {
      prefs.bgImage = prefs.bgImage || prefDefaults.bgImage;
      if (typeof prefs.bgImage === 'string')
        prefs.bgImage = escape(prefs.bgImage);

      if (isNaN(prefs.postsPerPage || prefDefaults.postsPerPage))
        prefs.postsPerPage = prefDefaults.postsPerPage; // use default is not a number
      prefs.postsPerPage = Math.max(Math.min(Number(prefs.postsPerPage), 12), 1);

      prefs.storyLayout = escape(prefs.storyLayout);
      if (!this.$store.getters.isValidLayoutID(prefs.storyLayout)) {
        prefs.storyLayout = prefDefaults.storyLayout;
        this.$toast.error(
          'Ungültiger Layoutparameter. Verwende Standardeinstellung.',
          { icon: 'fa-flash' }
        );
      }

      return prefs;
    }
  },
  mounted: function() {
    this.$axios.get('/img/backgrounds.json').then(res => {
      this.$store.commit('setBackgroundImages', res.data);

      let preferences = localStorage.getItem(
        this.$store.getters.getPreferencesKey
      );
      this.$store.dispatch(
        'setPreferences',
        preferences
          ? this.validatePreferences(JSON.parse(preferences))
          : prefDefaults
      );
    });
  }
};
</script>


<style lang="less">
html {
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

#wrapper {
  background-attachment: fixed;
  background-color: #333;
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  opacity: 1;
  transition: 1.5s opacity;
  width: 100%;
  &.faded {
    opacity: 0;
    transition: none;
  }
}
.adjust-fa .fa {
  transform: translateY(-5%);
}
.application--wrap {
  background-color: #212121;
  background-image: url(/img/overlay.png);
  background-repeat: repeat;
}
</style>
