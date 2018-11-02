<template>
  <div id="startOfComments">
    <a name="comments"></a>
    <v-card v-show="visible" class="mt-3">
      <v-toolbar 
        color="secondary lighten-2" 
        dark 
        height="40"
      >
        Kommentare &mdash; 
        <span class="ml-1">{{title}}</span>
        <v-spacer/>
        <v-btn icon @click.prevent="$emit('closeComments')">
          <v-icon color="secondary lighten-5" title="Kommentare ausblenden">fa-times</v-icon>
        </v-btn>
      </v-toolbar>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card 
            v-for="(comment, index) in comments" 
            :class="comment.parentid.length ? 'reply' : 'comment'"
            :key="comment._id"
            :id="'comment-' + index"
          >
            <v-divider v-if="index > 0" />
            <v-layout row d-flex>
              <v-flex class="avatar ml-3 pt-4">
                <img v-if="comment.email" class="authoricon" :src="`https://www.gravatar.com/avatar/${comment.email}?s=48&d=mp`" width="48">
                <img v-else-if="comment.author in $store.state.tdCommentators" class="authoricon" :src="$store.getters.getTdCommentatorAlias(comment.author)" width="48">
                <img v-else-if="isTwodayBlog(comment)" class="authoricon" :src="getTwodayBlogIconUrl(comment)" width="48" onerror="this.onerror=null;this.src='/img/user.png';">
                <img v-else class="authoricon opaque" src="/img/user.png" width="48">
              </v-flex>
              <v-flex>
                <v-card-title class="subheading d-flex">
                  <a v-if="comment.authorurl.length" 
                    class="authorlink teal--text text--lighten-1" 
                    target="_blank" 
                    :href="comment.authorurl">
                    {{comment.author}}
                  </a>
                  <span v-else 
                    class="authorlink notlinked">
                    {{comment.author}}
                  </span>
                  <v-spacer />
                  <timeago 
                    :datetime="comment.postdate" 
                    :title="comment.postdate" 
                    :autoUpdate="60" 
                    class="text-xs-right grey--text"
                  />
                </v-card-title>
                <v-card-text class="pt-0">
                  <v-runtime-template :template="contentTemplate(comment)"></v-runtime-template>
                </v-card-text>
                <v-card-actions class="mb-1">
                  <v-btn 
                    @click.prevent="openReplyForm(index)"
                    color="accent" 
                    dark
                    flat
                    ripple 
                    small
                    v-if="enabled"
                  >antworten</v-btn>
                </v-card-actions>              
              </v-flex>
            </v-layout>
            <CommentOrReply
              @closeComment="comments[index].selected = false"
              :id="'commentform-' + index"
              :parent="comment"
              v-if="enabled"
            />
          </v-card>
        </v-flex>
        <v-flex v-if="unapproved > 0" class="py-0">
          <div class="secondary lighten-2 white--text text-xs-center py-3">
            <i class="fa fa-info-circle mr-3"></i>{{unapprovedText}}
          </div>
        </v-flex>
      </v-layout>
    </v-card> 
  </div>   
</template>

<script>
import CommentOrReply from '~/components/CommentOrReply.vue';
import VRuntimeTemplate from 'v-runtime-template';

import loadScripts from 'load-scripts';

export default {
  components: {
    CommentOrReply,
    VRuntimeTemplate
  },
  props: {
    enabled: { // TRUE=commenting is allowed and not closed
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    unapproved: {
      type: Number,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    comments: function() {
      return this.$store.getters.getSortedComments;
    },
    unapprovedText: function() {
      return `${this.unapproved} weitere${this.unapproved===1 ? 'r' : ''} Kommentar${this.unapproved===1 ? '' : 'e'} ${this.unapproved===1 ? 'muss' : 'müssen'} noch freigeschaltet werden`;
    }
  },
  methods: {
    contentTemplate: function(comment) {
      return `<div class="vCommentContent">${comment.content}</div>`;
    },
    getKnownBlogIconUrl: function(comment) {
      const url = (this.$state.getters.getTdCommentatorAlias(comment.author));
      return (url.length ? url : '/img/user.png');
    },
    getTwodayBlogIconUrl: function(comment) {
      const url = (this.$state.getters.getTdCommentatorAlias(comment.author));
      return (
        url.length ?
        url :
        comment.authorurl +
        (comment.authorurl[comment.authorurl.length - 1] === '/' ? '' : '/') +
        'images/icon'
      );
    },
    isTwodayBlog: function(comment) {
      return !!comment.authorurl.match(/\.twoday\.net/);
    },
    openReplyForm: function(index) {
      this.comments.forEach((comment, idx) => {
        comment.selected = (idx == index);
      });
      setTimeout(() => {
        document
          .getElementById(`commentform-${index}`)
          .scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 200);
    },
    runVideoload: function() {
      video2day.run({
        contentClass: 'vCommentContent',
        debug: true,
        lazyLoad: true,
        selector: '.vCommentContent .html5video'
      });
    }
  },
  mounted: function() {

    // check for potential videoload instances in the comments
    if (this.$store.getters.isVideoloadUsedInComments)
      if (window.video2day) 
        this.runVideoload()
      else  
        loadScripts('./js/videoload2.js').then(() => { this.runVideoload(); });

    // scroll to comments when respective hash is used    
    setTimeout(() => {
      if (location.hash === '#comments') {
        document
          .getElementById('startOfComments')
          .scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);

  }
};
</script>

<style lang="less" scoped>
.avatar {
  max-width: 64px;
  min-width: 64px;
  text-align: center;
}
.authoricon {
  border-radius: 50%;
  &.opaque {
    opacity: 0.2;
  }
}
.authorlink {
  text-decoration: none;
  &.notlinked {
    color: #9e9e9e;
  }
}
.comment,
.reply {
  box-shadow: none;
}
.reply {
  margin-left: 76px;
}
</style>