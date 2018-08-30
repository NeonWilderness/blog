<template>
  <v-flex xs12>
    <v-card class="elevation-3">
      <a 
        class="storylink" 
        :href="'/'+post.basename" 
        v-if="!isSingleStoryView"
      >
        <v-card-media class="white--text" height="300px" :src="image">
          <v-container fill-height fluid>
            <v-layout>
              <v-flex align-end>
                <div class="headline posttitle">{{post.title}}</div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-media>
      </a>
      <v-toolbar 
        color="secondary" 
        dark
        height="60"
        v-if="isSingleStoryView"
      >
        <v-toolbar-title :data-id="post._id">{{post.title}}</v-toolbar-title>
      </v-toolbar>    
      <v-toolbar color="grey lighten-4 body-1" flat height="42">
        <v-icon>fa-calendar-o</v-icon>
        <v-subheader class="grey--text pl-2 pr-4" :title="post.date">{{post.date}}
        </v-subheader>
        <v-spacer v-if="!isSingleStoryView"></v-spacer>
        <v-icon>fa-eye</v-icon>
        <v-subheader class="grey--text pl-2 pr-4" title="gelesen">{{post.counter.reads || 0}}</v-subheader>
        <v-icon>fa-heart-o</v-icon>
        <v-subheader class="grey--text pl-2 pr-0" title="gut gefunden">{{post.counter.hearts || 0}}</v-subheader>
        <v-spacer v-if="isSingleStoryView"></v-spacer>
        <v-subheader class="px-0" v-if="isSingleStoryView">
          <v-icon>fa-tags</v-icon>
          <span class="grey--text pl-2">{{post.category.category}}</span>
        </v-subheader>
      </v-toolbar>
      <v-card-text 
        v-if="isSingleStoryView" 
        v-html="post.content"
      ></v-card-text>
      <v-card-text 
        class="storyabstract px-3" 
        style="position: relative"
        v-if="!isSingleStoryView"
      >
        <a 
          class="textlink" 
          :href="'/'+post.basename"
        >{{post.abstract}}</a>
        <v-btn 
          absolute 
          class="buttonlink"
          color="grey lighten-4" 
          icon 
          nuxt 
          right 
          :to="'/'+post.basename"
        >
          <v-icon>fa-chevron-right</v-icon>
        </v-btn>
      </v-card-text>
      <v-toolbar color="grey lighten-4 body-1" flat height="42" class="storyfooter">
        <v-layout align-center justify-space-around row>

          <v-flex 
            :xs4="isSingleStoryView"
            :xs6="!isSingleStoryView"
            class="text-xs-left"
          >
            <v-btn flat small @click.prevent="toggleComments">
              <v-icon>fa-comments-o</v-icon>
              <v-subheader class="grey--text pl-2">{{commentString}}</v-subheader>
            </v-btn>
          </v-flex>

          <v-flex 
            v-if="isSingleStoryView"
            xs4
            class="text-xs-center"
          >
            <v-btn flat small  @click.prevent="addComment">
              <v-icon>fa-pencil</v-icon>
              <v-subheader class="grey--text pl-2">Kommentar verfassen</v-subheader>
            </v-btn>
          </v-flex>

          <v-flex 
            :xs4="isSingleStoryView"
            :xs6="!isSingleStoryView"
            class="text-xs-right"
          >
            <v-btn icon title="Gefällt mir">
              <v-icon color="red">fa-heart</v-icon>
            </v-btn>
          </v-flex>

        </v-layout>
      </v-toolbar>    
    </v-card>    
    <Comments :comments="comments" :title="post.title" :visible="isCommentListVisible" />
  </v-flex>
</template>

<script>
import Comments from '~/components/Comments.vue';

export default {
  components: {
    Comments
  },
  props: {
    post: {
      type: Object,
      required: true
    },
    comments: {
      type: Array,
      required: false
    },
    view: { // grid=1-3 stories in a row | full=one story per page incl. comments
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      isCommentListVisible: (process.browser ? location.hash === '#comments' : false)
    };
  },
  computed: {
    commentString: function() {
      let comments = this.post.counter.comments || 0;
      return `${comments} Kommentar${comments == 1 ? '' : 'e' }`;
    },
    image: function() {
      return (this.post.image ? this.post.image.path : '/img/px1.png');
    },
    isSingleStoryView: function() {
      return this.view === 'full';
    }
  },
  methods: {
    addComment: function() {
      alert('addComment clicked!');
    },
    toggleComments: function() {
      if (this.isSingleStoryView) {
        if (this.comments.length > 0) {
          this.isCommentListVisible = !this.isCommentListVisible;
          if (this.isCommentListVisible) {
            document.getElementById('startOfComments').scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start'
            });
          }
        }
      } else {
        this.$router.push(`/${this.post.basename}#comments`);
      };
    }
  },
  mounted: function() {
    if (this.isSingleStoryView) { // update readcounter only when in full view mode
      let storiesRead = localStorage.getItem(this.$store.getters.getStoriesReadKey);
      storiesRead = storiesRead ? JSON.parse(storiesRead) : [];
      console.log(`storiesRead after parse: ${JSON.stringify(storiesRead)}`);
      if (storiesRead.indexOf(this.post._id) < 0) {
        storiesRead.push(this.post._id);
        localStorage.setItem(
          this.$store.getters.getStoriesReadKey, 
          JSON.stringify(storiesRead)
        );
        this.$store.dispatch('incPostCounter', {
          type: 'reads', 
          id: this.post._id,
          cockpit: this.$cockpit
        });
      }
    }
  }
}
</script>

<style lang="less" scoped>
.posttitle {
  background-color: rgba(227, 4, 37, .9); // #e30425 secondary
  line-height: 30px!important;
  padding: .3em .5em;  
}
.storylink {
  text-decoration: none;
  &:hover .posttitle {
    background-color: rgba(227, 4, 37, 1);
  }
}
.storyabstract {
  .textlink {
    color: rgba(0, 0, 0, .87);
    text-decoration: none;
  }
  .buttonlink {
    bottom: 16px;
    opacity: 0;
    transition: 1s opacity;
  }
  &:hover {
    .textlink {
      color: rgba(0, 0, 0, 1);
    }
    .buttonlink {
      opacity: 1;
    }
  }
}
</style>

