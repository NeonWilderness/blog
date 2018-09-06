<template>
  <v-layout row wrap v-show="isVisible">
    <v-flex xs12>
      <v-form 
        lazy-validation
        ref="commentform" 
        v-model="valid" 
      >
        <v-card>
          <v-card-text>
            <v-textarea
              autofocus
              box
              clearable
              hint="Bitte Kommentar eingeben"
              :label="getLabel"
              light
              persistent-hint
              :rules="contentRules"
              validate-on-blur
              v-model="content"
            ></v-textarea>
          </v-card-text> 
          <v-card-actions class="d-flex">
            <v-btn
              @click="saveReply"
              color="accent"
              dark
              flat
              ripple
              small
            >
              <v-icon>fa-send</v-icon> Kommentar absenden
            </v-btn>
            <v-btn
              @click="cancelReply"
              color="accent"
              dark
              flat
              ripple
              small
            >
              <v-icon>fa-times</v-icon> Abbrechen
            </v-btn>
          </v-card-actions> 
        </v-card>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: { // called from Story: postid and visible, called from Comments: parent
    postid: {
      type: String,
      required: false
    },
    visible: {
      type: Boolean,
      required: false
    },
    parent: {
      type: Object,
      required: false
    }
  },
  data: function() {
    return {
      content: '',
      contentRules: [
        v => !!v || 'Der Kommentartext darf nicht leer sein!',
        v => ((v || '').indexOf('<script>') < 0) || 'script-Befehle sind nicht erlaubt!'
      ],
      valid: true
    };
  },
  computed: {
    getLabel: function() {
      return `Antwort auf ${this.parent ? 'Kommentar' : 'Beitrag'}`;
    },
    isVisible: function() {
      return (this.parent ? this.parent.selected : this.visible);
    }
  },
  methods: {
    cancelReply: function() {
      this.$refs.commentform.reset();
      this.$emit('closeComment');
    },
    saveReply: function() {
      if (this.$refs.commentform.validate()) {
        this.$emit('closeComment');
      }
    }
  }
};
</script>

<style lang="less" scoped>
.comment .v-form {
  margin-bottom: 1px;
}
</style>