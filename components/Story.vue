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
        <v-icon>fa-comments-o</v-icon>
        <v-subheader class="grey--text pl-2">6 Kommentare</v-subheader>
        <v-spacer></v-spacer>
        <v-icon>fa-calendar-o</v-icon>
        <v-subheader class="grey--text pl-2 pr-4" title="27.07.2018 13:15">vor 2 Tagen</v-subheader>
        <v-icon>fa-eye</v-icon>
        <v-subheader class="grey--text pl-2 pr-4" title="gelesen">183</v-subheader>
        <v-icon>fa-heart-o</v-icon>
        <v-subheader class="grey--text pl-2 pr-1" title="gut gefunden">3</v-subheader>
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
      <v-toolbar color="grey lighten-4 body-1" flat height="42">
        <v-btn flat small>
          <v-icon>fa-pencil</v-icon>
          <v-subheader class="grey--text pl-2">Kommentar verfassen</v-subheader>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon title="Herz verschenken">
          <v-icon color="red">fa-heart</v-icon>
        </v-btn>
      </v-toolbar>    
    </v-card>    
  </v-flex>
</template>

<script>
export default {
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

