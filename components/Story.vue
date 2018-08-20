<template>
  <v-flex xs12>
    <v-card>
      <v-card-media class="white--text" height="300px" src="https://cdn.vuetifyjs.com/images/cards/docks.jpg">
        <v-container fill-height fluid>
          <v-layout fill-height>
            <v-flex xs12 align-end flexbox>
              <span class="headline">Redesigned. Redefined. Reborn.</span>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-media>
      <v-toolbar color="grey lighten-4 body-1" flat height="42">
        <v-icon>fa-calendar-o</v-icon>
        <v-subheader class="grey--text pl-2 pr-4" title="27.07.2018 13:15">vor 2 Tagen</v-subheader>
        <v-icon>fa-eye</v-icon>
        <v-subheader class="grey--text pl-2 pr-4" title="gelesen">183</v-subheader>
        <v-icon>fa-heart-o</v-icon>
        <v-subheader class="grey--text pl-2" title="gut gefunden">3</v-subheader>
        <v-spacer></v-spacer>
        <v-subheader class="px-0" v-if="$store.getters.isSingleStoryLayout">
          <v-icon>fa-tags</v-icon>
          <span class="grey--text pl-2">Außergewöhnliches</span>
        </v-subheader>
      </v-toolbar>    
      <v-card-text class="px-3">
        <cite>
          <blockquote class="mb-2">
            <v-icon>fa-quote-left fa-2x</v-icon>
            I’ve seen things you people wouldn’t believe. Attack ships on fire off the shoulder of Orion. 
            I’ve watched C-beams glitter in the dark near the Tannhauser Gate. 
            <span style="color:#222">All those moments will be lost in time, like tears in the rain.
            [...] Time to die.</span>&ensp; 
            <a style="font-size:.8em" target="_blank" href="https://de.wikipedia.org/wiki/Tannh%C3%A4user_Tor" title="">[deutsch]</a>
          </blockquote>
          Roy Batty
        </cite>
      </v-card-text>
      <v-toolbar color="grey lighten-4 body-1" flat height="42" class="storyfooter">
        <v-layout align-center justify-space-around row>
          <v-flex xs4 class="text-xs-left" v-if="$store.getters.isSingleStoryLayout">
            <v-btn flat small>
              <v-icon>fa-pencil</v-icon>
              <v-subheader class="grey--text pl-2">Kommentar verfassen</v-subheader>
            </v-btn>
          </v-flex>
          <v-flex 
            :xs4="$store.getters.isSingleStoryLayout"
            :xs6="!$store.getters.isSingleStoryLayout"
            :class="'text-xs-' + ($store.getters.isSingleStoryLayout ? 'center' : 'left')">
            <v-btn flat small>
              <v-icon>fa-comments-o</v-icon>
              <v-subheader class="grey--text pl-2">6 Kommentare</v-subheader>
            </v-btn>
          </v-flex>
          <v-flex 
            :xs4="$store.getters.isSingleStoryLayout"
            :xs6="!$store.getters.isSingleStoryLayout"
            class="text-xs-right">
            <v-btn icon title="I like this">
              <v-icon color="red">fa-heart</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-toolbar>    
    </v-card>    
  </v-flex>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
    };
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
</style>

