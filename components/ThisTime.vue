<template>
  <v-flex xs12 mt-3>
    <v-toolbar color="purple darken-1" dark>
      <v-toolbar-title>This Time</v-toolbar-title>
    </v-toolbar>    
    <v-card>
      <v-layout row wrap>
        <v-flex xs12>
          <v-list dense class="dense">
            <v-list-tile avatar>
              <v-list-tile-avatar><v-icon>fa-clock-o</v-icon></v-list-tile-avatar>
              <v-list-tile-title :title="firstStoryDate">{{getAge}} days</v-list-tile-title>
            </v-list-tile>
            <v-list-tile avatar>
              <v-list-tile-avatar><v-icon>fa-birthday-cake</v-icon></v-list-tile-avatar>
              <v-list-tile-title>{{getDaysToNextBirthday}} days to go before {{getAnniversary}}<sup>th</sup> anniversary</v-list-tile-title>
            </v-list-tile>
            <v-list-tile avatar>
              <v-list-tile-avatar><v-icon>fa-gavel</v-icon></v-list-tile-avatar>
              <v-list-tile-title v-html="copyright"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-flex>
        <v-flex xs12 class="logos px-5">
          <v-layout align-center row>
            <v-flex xs4><LogoNuxt /></v-flex>
            <v-flex xs4><LogoVue /></v-flex>
            <v-flex xs4><LogoVuetify style="width:70%" /></v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 style="margin-top:-1rem">
          <div class="body-1 grey--text text-lighten-1 mb-2 text-xs-center">Made with Nuxt, Vue, Vuetify &amp; JS love.</div>
        </v-flex>
      </v-layout>
    </v-card>    
  </v-flex>
</template>

<script>
import LogoNuxt from '~/assets/nuxtjs.svg';
import LogoVue from '~/assets/vuejs.svg';
import LogoVuetify from '~/assets/vuetifyjs.svg';
const day = 1000 * 60 * 60 * 24;

export default {
  components: {
    LogoNuxt,
    LogoVue,
    LogoVuetify
  },
  computed: {
    copyright: function() {
      return `&copy; 2006-${new Date().getFullYear()} NeonWilderness`;
    },
    firstStoryDate: function() {
      return this.$store.state.firstStoryDate;
    },
    getAge: function() {
      return Math.floor((Date.now() - Date.parse(this.firstStoryDate)) / day);
    },
    getAnniversary: function() {
      return this.getYearNextBirthday - 2006;
    },
    getDaysToNextBirthday: function() {
      let daysToGo =
        Math.floor((Date.parse(`${this.getYearNextBirthday}${this.firstStoryDate.substr(4)}`) - Date.now()) /
        day);
      return daysToGo;  
    },
    getYearNextBirthday: function() {
      let thisYearsBirthday = Date.parse(
        `${new Date().getFullYear()}${this.firstStoryDate.substr(4)}`
      );
      let isNextYear = Date.now() > thisYearsBirthday;
      return new Date().getFullYear() + Number(isNextYear);
    }
  }
};
</script>

<style lang="less">
@keyframes pulse {
  from {
    transform: scale3d(1, 1, 1);
  }
  50% {
    transform: scale3d(1.015, 1.015, 1);
  }
  to {
    transform: scale3d(1, 1, 1);
  }
}
.logos svg {
  width: 100%;
  height: auto;
}
.vuejs_svg__pulse {
  animation: pulse 1.5s infinite;
}
</style>