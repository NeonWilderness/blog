<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card color="white">
        <v-img
          src="//neonwilderness.blogroll.me/cockpit/storage/uploads/images/404.jpg"
          aspect-ratio="1.66667"
        ></v-img>

        <v-card-title primary-title>
          <div style="margin:0 auto">
            <h3 class="headline mb-2">Houston, we have a problem...</h3>
            <div v-if="error.statusCode === 404">Oups!! Sorry, aber die gesuchte Seite existiert leider nicht (mehr)!<div class="body-2 mt-2 teal--text">{{error.path}}</div></div>
            <div v-else-if="error.statusCode === 423">Achtung!! Die Kommentarfunktion wurde temporär ausgesetzt, da sich zu viele "unmoderierte" Kommentare in der Datenbank befinden!</div>
            <div v-else>Verflixt, da muss etwas mächtig schief gegangen sein!</div>
          </div>
        </v-card-title>

        <div class="text-xs-center pb-3">
          <v-btn color="error" to="/">
            <v-icon>fa-ambulance fa-lg</v-icon>&ensp;Zur NeonWilderness Homepage
          </v-btn>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ['error'],
  layout: 'default',
  mounted: function() {
    console.log('ErrorPage:', this.error.statusCode, JSON.stringify(this.error));
  }
}
</script>