<template>
  <v-app>
    <div id="wrapper" :class="{faded: isImgLoading}" :style="{backgroundImage: 'url('+ $store.state.bgImage +')'}">
      <v-container fluid grid-list-md style="padding:0">
        <nuxt/>
      </v-container>
    </div>
  </v-app>
</template>

<script>
export default {
  data: function() {
    return {
      isImgLoading: true
    };
  },
  mounted: function() {
    const useRandomImage = 0;

    this.$axios.get('/img/backgrounds.json').then(res => {

      this.$store.commit('setBackgroundImages', res.data);

      let preferences = localStorage.getItem(this.$store.getters.getPreferencesKey);
      if (preferences) { // found preferences in localStorage
        preferences = JSON.parse(preferences);
        this.$store.commit('setCurrentBackgroundImage', preferences.bgImage);
        this.$store.commit('setStoryLayout', preferences.storyLayout);
      } else { // no preferences, then use defaults
        this.$store.commit('setCurrentBackgroundImage', useRandomImage);
        this.$store.commit('setStoryLayout', 'single');
      }

      let img = new Image();
      img.src = this.$store.getters.getCurrentBackgroundImage;
      img.onload = () => {
        this.bgImage = img.src;
        this.isImgLoading = false;
      };

    });
  }
};
</script>


<style lang="less">
html {
  font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Helvetica Neue", Arial, sans-serif;
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
</style>
