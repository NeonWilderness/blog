<template>
  <v-card v-show="visible" class="mt-3">
    <a name="comments" id="startOfComments"></a>
    <v-toolbar 
      color="secondary lighten-2" 
      dark 
      height="40"
    >Kommentare &mdash; <span class="ml-1">{{title}}</span></v-toolbar>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card 
          v-for="(comment, index) in getSortedComments" 
          :class="comment.type"
          :key="comment._id"
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
              <v-card-text v-html="comment.content" class="pt-0"></v-card-text>
              <v-card-actions class="mb-1">
                <v-btn 
                  color="accent" 
                  dark
                  flat
                  ripple 
                  small
                >antworten</v-btn>
              </v-card-actions>              
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-card>    
</template>

<script>
export default {
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
    getSortedComments: function() {
      return this.comments
        .filter(commentOrReply => !commentOrReply.parentid.length)
        .reduce((all, comment) => {
          all.push(Object.assign(comment, {type: 'comment'}));
          return all.concat(
            this.comments
              .filter(commentOrReply => commentOrReply.parentid === comment._id)
              .map(reply => Object.assign(reply, {type: 'reply'}))
          );
        }, [])
    }
  },
  mounted: function() {
    setTimeout(function(){
      if (location.hash === '#comments') {
        document.getElementById('startOfComments').scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 500);
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

