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
import axios from 'axios';

export default {
  data: function() {
    return {
      isImgLoading: true
    };
  },
  mounted: function() {
    axios.get('/img/backgrounds.json').then(res => {
      let bgImages = res.data;

      if (Array.isArray(bgImages) && bgImages.length) {

        this.$store.commit('setBackgroundImages', bgImages);
        let randomIdx = Math.floor(Math.random() * bgImages.length);
        this.$store.commit('setCurrentBackgroundImage', randomIdx);

        let img = new Image();
        img.src = this.$store.getters.getCurrentBackgroundImage;
        img.onload = () => {
          this.bgImage = img.src;
          this.isImgLoading = false;
        };
      }
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
