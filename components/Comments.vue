<template>
  <div id="startOfComments">
    <a name="comments"></a>
    <v-card v-show="visible" class="mt-3">
      <v-toolbar 
        color="secondary lighten-2" 
        dark 
        height="40"
      >
        <span class="hidden-sm-and-down">Kommentare &mdash; </span>
        <span class="ml-1">{{title}}</span>
        <v-spacer/>
        <v-btn icon @click.prevent="$emit('closeComments')">
          <v-icon color="secondary lighten-5" title="Kommentare ausblenden">fa-times</v-icon>
        </v-btn>
      </v-toolbar>
      <v-layout row wrap>
        <v-subheader v-if="!comments.length">Noch kein Kommentar vorhanden.</v-subheader>
        <v-flex xs12 v-else>
          <v-card 
            v-for="(comment, index) in comments" 
            :class="comment.parentid.length ? 'reply' : 'comment'"
            elevation="0"
            :key="comment._id"
            :id="'comment-' + index"
          >
            <v-divider v-if="index > 0" />
            <v-layout row d-flex>
              <v-flex class="avatar ml-3 pt-4">
                <Avatar :comment="comment" />
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
                  <Content :embed="comment.content" type="Comment" />
                </v-card-text>
                <v-card-actions class="mb-1">
                  <v-btn 
                    @click.stop="openReplyForm(index, $event)"
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
              @updatedCounter="propagateCounter"
              :id="'commentform-' + index"
              :parent="comment"
              v-if="enabled"
            ></CommentOrReply>
          </v-card>
        </v-flex>
        <v-flex v-if="unapproved>0" class="py-0">
          <div class="secondary lighten-2 white--text text-xs-center py-3">
            <i class="fa fa-info-circle mr-3"></i>{{unapprovedText}}
          </div>
        </v-flex>
      </v-layout>
    </v-card> 
  </div>   
</template>

<script>
import Avatar from '~/components/Avatar.vue';
import CommentOrReply from '~/components/CommentOrReply.vue';
import Content from '~/components/Content.vue';

import loadScripts from 'load-scripts';

export default {
  components: {
    Avatar,
    CommentOrReply,
    Content
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
  data: function() {
    return {};
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
    openReplyForm: function(index, e) {
      e.currentTarget.disabled = true;
      if (e.ctrlKey && e.shiftKey)
        window.open(`${process.env.APIURL}/collections/entry/comments/${this.comments[index]._id}`, '_blank');
      else {  
        this.comments.forEach((comment, idx) => {
          comment.selected = (idx == index);
        });
        setTimeout(() => {
          document
            .getElementById(`commentform-${index}`)
            .scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 200);
      }
      e.currentTarget.disabled = false;
    },
    propagateCounter: function(counter) {
      this.$emit('updatedCounter', counter);
    },
    runVideoload: function() {
      video2day.run({
        contentClass: 'vCommentContent',
        debug: false,
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
        loadScripts('/js/videoload2.js').then(() => { this.runVideoload(); });

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