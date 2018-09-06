<template>
  <v-flex xs12>
    <v-card class="elevation-3">
      <a 
        class="storylink" 
        :href="'/'+post.basename" 
        v-if="!isSingleStoryView"
      >
        <v-img class="white--text" height="300px" :src="image">
          <v-container fill-height fluid>
            <v-layout>
              <v-flex align-end>
                <div class="headline posttitle">{{post.title}}</div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-img>
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
      <v-card-text v-if="isSingleStoryView">
        <v-runtime-template :template="'<div>' + post.content + '</div>'"></v-runtime-template>
      </v-card-text>
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
            <v-btn icon title="Gefällt mir" @click.prevent="heartStory">
              <v-icon color="red">fa-heart</v-icon>
            </v-btn>
          </v-flex>

        </v-layout>
      </v-toolbar>    
    </v-card>
    <v-toolbar
      class="mt-2"
      color="transparent"
      id="pagingBar"
      style="box-shadow:none" 
      v-if="isSingleStoryView"
    >
      <v-btn color="grey darken-4" dark :disabled="!hasYoungerPost" fab :to="'/' + basenameYoungerPost">
        <v-icon dark>fa-chevron-left fa-lg</v-icon>
      </v-btn>
      <v-spacer/>      
      <v-btn color="grey darken-4" dark :disabled="!hasOlderPost" fab :to="'/' + basenameOlderPost">
        <v-icon dark>fa-chevron-right fa-lg</v-icon>
      </v-btn>      
    </v-toolbar>
    <CommentOrReply 
      :postid="post._id" 
      :visible="isAddCommentVisible"
      @closeComment="isAddCommentVisible = false"
    />
    <Comments 
      :comments="comments" 
      :title="post.title" 
      :visible="isCommentListVisible"
      @closeComments="collapseComments"
    />
  </v-flex>
</template>

<script>
import Comments from '~/components/Comments.vue';
import CommentOrReply from '~/components/CommentOrReply.vue';
import VRuntimeTemplate from 'v-runtime-template';

export default {
  components: {
    Comments,
    CommentOrReply,
    VRuntimeTemplate
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
    view: {
      // 'grid'=1-3 stories in a row | 'full'=one story per page incl. comments
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      isAddCommentVisible: false,
      isCommentListVisible: (process.browser ? location.hash === '#comments' : false)
    };
  },
  computed: {
    basenameOlderPost: function() {
      return this.$store.getters.getPostOlder(this.postIndex);
    },
    basenameYoungerPost: function() {
      return this.$store.getters.getPostYounger(this.postIndex);
    },
    commentString: function() {
      let comments = this.post.counter.comments || 0;
      return `${comments} Kommentar${comments === 1 ? '' : 'e'}`;
    },
    hasOlderPost: function() {
      return !!this.basenameOlderPost;
    },
    hasYoungerPost: function() {
      return !!this.basenameYoungerPost;
    },
    image: function() {
      return this.post.image ? this.post.image.path : '/img/px1.png';
    },
    isSingleStoryView: function() {
      return this.view === 'full';
    },
    postIndex: function() {
      return this.$store.getters.getIndexOfBasename(this.post.basename);
    }
  },
  methods: {
    addComment: function() {
      console.dir(this.$el);
      this.isAddCommentVisible = true;
    },
    collapseComments: function() {
      this.toggleComments();
      document.getElementById('pagingBar').scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    },
    heartStory: function() {
      if (this.updateStoryList('hearts')) {
        this.$toast.success(
          'Hey - vielen Dank! Freut mich sehr, dass dir der Beitrag gefallen hat!',
          { icon: 'fa-heart' }
        );
      } else {
        this.$toast.info(
          'Hach, das ist wirklich sehr nett, aber du hast bereits ein Herz für diesen Beitrag vergeben! ;)',
          { icon: 'fa-heart' }
        );
      }
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
      }
    },
    updateStoryList: async function(type) {
      // {string} type = reads|hearts
      let storageKey = this.$store.getters.getStoryStateKey(type);
      let storiesType = localStorage.getItem(storageKey);
      storiesType = storiesType ? JSON.parse(storiesType) : [];
      if (storiesType.indexOf(this.post._id) > 0) return Promise.resolve(false);
      else {
        storiesType.push(this.post._id);
        localStorage.setItem(storageKey, JSON.stringify(storiesType));
        return await this.$store.dispatch('incPostCounter', {
          type,
          id: this.post._id,
          cockpit: this.$cockpit
        });
      }
    }
  },
  mounted: function() {
    // update readcounter only when in full view mode
    if (this.isSingleStoryView) this.updateStoryList('reads');
  }
};
</script>

<style lang="less" scoped>
.posttitle {
  background-color: rgba(227, 4, 37, 0.9); // #e30425 secondary
  line-height: 30px !important;
  padding: 0.3em 0.5em;
}
.storylink {
  text-decoration: none;
  &:hover .posttitle {
    background-color: rgba(227, 4, 37, 1);
  }
}
.storyabstract {
  .textlink {
    color: rgba(0, 0, 0, 0.87);
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
.v-toolbar .v-subheader {
  height: auto;
}
</style>

