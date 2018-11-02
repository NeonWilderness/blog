<template>
  <v-dialog
    no-click-animation
    persistent
    v-model="active" 
    width="800"
  >
    <v-card color="white" tile>
      <v-toolbar card color="purple darken-1" dark dense>
        <v-toolbar-title>Hilfe zu Kommentaren</v-toolbar-title>
        <v-spacer />
        <v-btn icon dark @click.stop="$emit('closeHelp')">
          <v-icon>fa-times</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="grey--text text--darken-1 helptext">
        <v-subheader class="pa-0 teal--text">Eingabedaten / Muss- und Kannfelder</v-subheader>
        <p class="body-1 mb-0">Neben dem Kommentartext ist Ihr Name/Nick ein Pflichtfeld und darf nicht leer bleiben. E-Mail und Blog-URL können eingegeben werden, sind jedoch nicht erforderlich. Die E-Mail-Adresse, sofern eingegeben, wird ausschließlich verschlüsselt gespeichert und dazu verwendet, via <a target="_blank" href="https://de.gravatar.com/">Gravatar</a> ein Avatarbild zu laden, welches dann neben Ihrem Kommentar angezeigt wird.</p>
        <p class="body-1">Falls Sie einen Gravatar-Account besitzen (z.B. als Wordpress-Benutzer/Kommentierer) und Ihre E-Mail-Adresse als erstes eingeben, werden die Felder <em>Name</em> und <em>Blog-URL</em> aus den Gravatarinformationen vorbelegt.</p>
        <v-subheader class="pa-0 teal--text">Speicherung</v-subheader>
        <p class="body-1">Die eingegebenen bzw. via Gravatar ermittelten Daten (Name, E-Mail, Blog-URL) werden im lokalen Speicher Ihres Browsers (also auf Ihrem Rechner) gesichert, sodass sie beim nächsten Kommentar bereits vorbelegt werden können. Die Speicherung in Ihrem Browserspeicher können Sie in den Einstellungen (Klick auf <v-icon>fa-cog</v-icon> rechts auf der Homepage) deaktivieren.</p>
        <v-subheader class="pa-0 teal--text">Sicherheit / Moderation</v-subheader>
        <p class="body-1 mb-0">Jeder eingegebene Kommentar wird moderiert und erst nach der Moderation angezeigt. Ausnahme: Falls bereits <b>2</b> Ihrer Kommentare erfolgreich moderiert wurden, wird Ihr neuer Kommentar sofort angezeigt (für diese "Sofortmoderation" muss jedoch die E-Mail-Adresse als Kennung eingegeben werden). <span class="font-weight-bold">Befinden sich mehr als 20 unmoderierte Kommentare in der Datenbank, wird die Kommentarfunktion temporär ausgesetzt.</span></p>    
      </v-card-text>
      <v-card-actions>
        <v-btn
          @click.stop="$emit('closeHelp')"
          color="accent"
          dark
          flat
          ripple
          small
          style="flex:1"
        >
          <v-icon>fa-times</v-icon>&nbsp;Schließen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      required: true,
    }
  },
  data: function() {
    return {};
  },
  computed: {
  }
}
</script>

<style lang="less" scoped>
.helptext {
  .v-icon {
    line-height: 1.1;
  }
  .v-subheader {
    height: 30px;
  }
}
</style>