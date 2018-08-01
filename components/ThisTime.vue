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
              <v-list-tile-title>{{getAge}} days</v-list-tile-title>
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
      </v-layout>
    </v-card>    
  </v-flex>
</template>

<script>
const day = 1000 * 60 * 60 * 24;
export default {
  data: function() {
    return {
      firstStoryDate: '2006-10-24 03:16'
    };
  },
  computed: {
    copyright: function() {
      return `&copy; 2006-${new Date().getFullYear()} NeonWilderness`;
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
</style>

