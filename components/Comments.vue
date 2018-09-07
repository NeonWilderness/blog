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
            :class="comment.type"
            :key="comment._id"
            :id="'comment-' + index"
          >
            <v-divider v-if="index > 0" />
            <v-layout row d-flex>
              <v-flex class="avatar ml-3 pt-4">
                <img class="authoricon" src="/img/user.png" width="48">
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
                  <v-runtime-template :template="'<div>' + comment.content + '</div>'"></v-runtime-template>
                </v-card-text>
                <v-card-actions class="mb-1">
                  <v-btn 
                    @click="addReply(index)"
                    color="accent" 
                    dark
                    flat
                    ripple 
                    small
                  >antworten</v-btn>
                </v-card-actions>              
              </v-flex>
            </v-layout>
            <CommentOrReply
              :id="'commentform-' + index"
              :parent="comment"
              @closeComment="comments[index].selected = false"
            />
          </v-card>
        </v-flex>
      </v-layout>
    </v-card> 
  </div>   
</template>

<script>
import CommentOrReply from '~/components/CommentOrReply.vue';
import VRuntimeTemplate from 'v-runtime-template';

export default {
  components: {
    CommentOrReply,
    VRuntimeTemplate
  },
  props: {
    comments: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  computed: {
  },
  methods: {
    addReply: function(index) {
      this.comments.forEach((comment, idx) => { comment.selected = (idx === index) });
      setTimeout(function() {
        document.getElementById(`commentform-${index}`)
          .scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  },
  mounted: function() {
    setTimeout(function(){
      if (location.hash === '#comments') {
        document.getElementById('startOfComments')
          .scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }  
}
</script>

<style lang="less" scoped>
.avatar {
  max-width: 64px;
  min-width: 64px;
  text-align: center;
}
.authoricon {
  border-radius: 50%;
  opacity: .2;
}
.authorlink {
  text-decoration: none;
  &.notlinked {
    color: #9e9e9e;
  }
}
.comment, .reply {
  box-shadow: none;
}
.reply {
  margin-left: 76px;
}
</style>

