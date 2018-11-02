<template>
  <v-flex xs12>
    <v-card class="elevation-3">
      <a 
        class="storylink" 
        @click.prevent="goToPost()"
        v-if="!isSingleStoryView"
      >
        <v-img 
          :aspect-ratio="16/9"
          class="white--text" 
          position="top center"
          :src="image"
        >
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
        <v-subheader class="grey--text pl-2 pr-4" title="gelesen">{{post.counter.reads}}</v-subheader>
        <v-icon>fa-heart-o</v-icon>
        <v-subheader class="grey--text pl-2 pr-0" title="gut gefunden">{{post.counter.hearts}}</v-subheader>
        <v-spacer v-if="isSingleStoryView"></v-spacer>
        <v-subheader 
          class="px-0 categoryslug" 
          @click.stop="switchToCategory"
          title="Mehr aus dieser Kategorie anzeigen"
          v-if="isSingleStoryView">
          <v-icon>fa-tags</v-icon>
          <span class="grey--text pl-2">{{post.category.category}}</span>
        </v-subheader>
      </v-toolbar>
      <v-card-text v-if="isSingleStoryView">
        <v-runtime-template :template="contentTemplate"></v-runtime-template>
      </v-card-text>
      <v-card-text 
        class="storyabstract px-3" 
        style="position: relative"
        v-if="!isSingleStoryView"
      >
        <a 
          class="textlink" 
          @click.prevent="goToPost()"
        >{{post.abstract}}</a>
        <v-btn 
          absolute 
          class="buttonlink"
          color="grey lighten-4" 
          icon 
          nuxt 
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
            <v-btn flat small @click.prevent.stop="toggleComments">
              <v-icon>fa-comments-o</v-icon>
              <v-subheader class="grey--text pl-2">{{commentString}}</v-subheader>
            </v-btn>
          </v-flex>

          <v-flex 
            v-if="isSingleStoryView && !commentsDisabled"
            xs4
            class="text-xs-center"
          >
            <v-btn flat small  @click.prevent.stop="addComment">
              <v-icon>fa-pencil</v-icon>
              <v-subheader class="grey--text pl-2">Kommentar verfassen</v-subheader>
            </v-btn>
          </v-flex>
          <v-flex
            v-if="commentsDisabled"
            xs4
            class="text-xs-center"
          >
            <v-chip disabled label outline small>
              <span v-if="!post.commentsallowed">Kommentarfunktion deaktiviert</span>
              <span v-if="post.commentsclosed">Kommentare geschlossen</span>
            </v-chip>
          </v-flex>

          <v-flex 
            :xs4="isSingleStoryView"
            :xs6="!isSingleStoryView"
            class="text-xs-right"
          >
            <v-btn icon title="Gefällt mir" @click.prevent.stop="heartStory">
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
      id="commentform"
      :postid="post._id" 
      :visible="isAddCommentVisible"
      v-if="isSingleStoryView"
      @closeComment="isAddCommentVisible = false"
    />
    <Comments 
      :enabled="!commentsDisabled"
      :title="post.title"
      :unapproved="unapprovedComments" 
      :visible="isCommentListVisible"
      v-if="isSingleStoryView"
      @closeComments="collapseComments"
    />
  </v-flex>
</template>

<script>
import Comments from '~/components/Comments.vue';
import CommentOrReply from '~/components/CommentOrReply.vue';
import VRuntimeTemplate from 'v-runtime-template';

import loadScripts from 'load-scripts';

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
    view: {
      // 'grid'=1-3 stories in a row | 'full'=one story per page incl. comments
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      isAddCommentVisible: false,
      isCommentListVisible: process.browser
        ? location.hash === '#comments'
        : false
    };
  },
  computed: {
    basenameOlderPost: function() {
      return this.$store.getters.getPostOlder(this.postIndex);
    },
    basenameYoungerPost: function() {
      return this.$store.getters.getPostYounger(this.postIndex);
    },
    comments: function() {
      return (this.view === 'full' ? this.$store.getters.getSortedComments : []);
    },
    commentsDisabled: function() {
      return (!this.post.commentsallowed || this.post.commentsclosed);
    },
    contentTemplate: function() {
      return `<div class="vPostContent">${this.post.content}</div>`;
    },
    numberOfCommentsInDB: function() {
      let { comments } = this.$store.getters.getCounterByPostId(this.post._id);
      return comments;
    },
    commentString: function() {
      let n = this.numberOfCommentsInDB;
      return `${n} Kommentar${n === 1 ? '' : 'e'}`;
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
    },
    unapprovedComments: function() {
      return (this.numberOfCommentsInDB - this.comments.length);
    }
  },
  methods: {
    addComment: function(e) {
      e.currentTarget.disabled = true;
      if (e.ctrlKey && e.shiftKey)
        window.open(`${process.env.BASEURL}/cockpit/collections/entry/posts/${this.post._id}`, '_blank');
      else {  
        this.isAddCommentVisible = true;
        setTimeout(() => {
          document
            .getElementById('commentform')
            .scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 200);
      }
      e.currentTarget.disabled = false;
    },
    collapseComments: function() {
      this.toggleComments();
      document.getElementById('pagingBar').scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    },
    goToPost: function(hash) {
      this.$router.push(`/${this.post.basename}${hash || ''}`);
    },
    heartStory: function() {
      this.updateStoryList('hearts').then(counterIncreased => {
        if (counterIncreased) {
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
      });
    },
    switchToCategory: function() {
      this.$store.dispatch('setCategory', this.post.category.slug);
      this.$router.push('/');
    },
    toggleComments: function(e) {
      if (this.isSingleStoryView) {
        if (e) e.currentTarget.disabled = true;
        if (this.comments.length > 0) {
          this.isCommentListVisible = !this.isCommentListVisible;
          if (this.isCommentListVisible) {
            setTimeout(() => {
              this.$vuetify.goTo(
                '.storyfooter', 
                {duration:400, offset:0}
              );
            }, 200);
          }
        }
        if (e) e.currentTarget.disabled = false;
      } else {
        this.goToPost('#comments');
      }
    },
    updateStoryList: function(type) {
      // {string} type = reads|hearts
      let storageKey = this.$store.getters.getStoryStateKey(type);
      let storiesType = localStorage.getItem(storageKey);
      storiesType = storiesType ? JSON.parse(storiesType) : [];
      if (storiesType.indexOf(this.post._id) >= 0)
        return Promise.resolve(false);
      else {
        this.post.counter[type]++;
        storiesType.push(this.post._id);
        localStorage.setItem(storageKey, JSON.stringify(storiesType));
        return this.$store.dispatch('incPostCounter', {
          type,
          id: this.post._id,
          cockpit: this.$cockpit
        });
      }
    }
  },
  mounted: function() {
    // only when in full view mode
    if (this.isSingleStoryView) {
      // update the story's readcounter
      this.updateStoryList('reads');
      // and check for potential videoload instances in the post
      if (this.post.videoload)
        loadScripts('./js/videoload2.js').then(() => {
          video2day.run({
            contentClass: 'vPostContent',
            debug: true,
            lazyLoad: true,
            selector: '.vPostContent .html5video'
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.categoryslug {
  cursor: pointer;
  &:hover span {
    color: #757575!important;
  }
}
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
    bottom: 14px;
    opacity: 0;
    right: 14px;
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