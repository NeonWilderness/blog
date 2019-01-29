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
            <v-layout wrap>
              <v-flex xs12 sm6>
                <v-text-field
                  append-icon="fa-user-o"
                  class="required"
                  clearable
                  label="Name"
                  :rules="[() => !!name || 'Die Namenseingabe ist erforderlich!']"
                  type="text"
                  v-model.trim="name"
                ></v-text-field>            
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  append-icon="fa-envelope-o"
                  @blur="getAvatarJson"
                  clearable
                  hint="Die E-Mail-Adresse wird zur Anzeige des Avatar-Icons verwendet"
                  label="E-Mail"
                  persistent-hint
                  type="email"
                  v-model.trim="email"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-text-field
              append-icon="fa-link"
              clearable
              label="Blog-URL"
              type="url"
              v-model.trim="url"
            ></v-text-field>            
          </v-card-text> 
          <v-card-actions>
            <v-btn
              @click.stop="showHelp=true"
              color="accent"
              dark
              flat
              ripple
              small
              style="flex:1"
            >
              <v-icon>fa-question-circle-o</v-icon> Hilfe
            </v-btn>
            <v-btn
              @click.stop="saveReply"
              color="accent"
              dark
              flat
              ripple
              small
              style="flex:1"
            >
              <v-icon>fa-send</v-icon> 
              <span v-if="$vuetify.breakpoint.smAndUp">Kommentar absenden</span>
              <span v-else>Senden</span>
            </v-btn>
            <v-btn
              @click.stop="cancelReply"
              color="accent"
              dark
              flat
              ripple
              small
              style="flex:1"
            >
              <v-icon>fa-times</v-icon> Abbrechen
            </v-btn>
          </v-card-actions> 
        </v-card>
      </v-form>
    </v-flex>
    <CommentHelp 
      v-if="showHelp"
      :active="showHelp"
      @closeHelp="showHelp=false"
    ></CommentHelp>
  </v-layout>
</template>

<script>
import CommentHelp from "~/components/CommentHelp.vue";
import { format } from 'date-fns';
import md5 from 'md5';

export default {
  components: {
    CommentHelp
  },
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
      email: this.$store.state.credentials.email,
      hash: '',
      name: this.$store.state.credentials.name,
      showHelp: false,
      url: this.$store.state.credentials.url,
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
    getAvatarJson: function() {
      this.email = (this.email || '').toLowerCase();
      if (this.email) {
        this.hash = md5(this.email);
        this.$axios.get(`https://de.gravatar.com/${this.hash}.json`).then(res => {
          let entry = res.data.entry[0];
          if (!this.name && entry.displayName) this.name = entry.displayName;
          if (!this.url && entry.urls && entry.urls.length > 0) this.url = entry.urls[0].value;
        })
        .catch(err => console.log(`No gravatar data for: ${this.email}.`));
      }
    },
    saveCredentials: function() {
      if (process.browser && 
        this.$store.getters.getRememberGravatar && 
        this.$store.getters.isCredentialChange(this.email, this.name, this.url)
      ) {
        localStorage.setItem(this.$store.getters.getCredentialsKey, JSON.stringify({
          email: this.email,
          name: this.name,
          url: this.url
        }));
      }
    },
    saveReply: function(e) {
      if (this.$refs.commentform.validate()) {

        e.currentTarget.disabled = true;
        this.saveCredentials();

        let comment = {
          postid: (this.parent ? this.parent.postid : this.postid),
          postdate: format(new Date(), 'YYYY-MM-DD HH:mm'),
          author: this.name,
          authorurl: this.url,
          email: this.hash,
          reviewed: false,
          approved: false,
          content: this.content,
          parentid: (this.parent ? (this.parent.parentid ? this.parent.parentid : this.parent._id) : '')
        };

        this.$store.dispatch('saveComment', comment)
          .then(() => {
            let msg = (
              this.$store.getters.wasLastCommentAutoApproved ? 
              'Er wurde sofort freigeschaltet' : 
              'Sobald er freigeschaltet ist, wird er hier angezeigt'
            );
            this.content = '';
            return this.$toast.success(`Vielen Dank für deinen Kommentar! ${msg}.`, {icon: 'fa-check'});
          });

        e.currentTarget.disabled = false;
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