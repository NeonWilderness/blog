<template>
  <v-flex xs12>
    <v-toolbar color="purple darken-1" dark>
      <v-toolbar-title>Weeping Willow</v-toolbar-title>
    </v-toolbar>    
    <v-card>
      <v-layout row wrap>
        <v-flex xs12>
          <v-list three-line>
            <template v-for="(comment, index) in $store.state.mostRecentComments">
              <v-divider :inset="true" :key="index" v-if="index>0"></v-divider>
              <v-list-tile avatar :key="comment._id">
                <v-list-tile-avatar><img src="/img/user.png"></v-list-tile-avatar>
                <v-list-tile-content>
                  <a class="commentlink" :href="'/' + comment.basename + '#comments'">
                    <div class="comment mb-2">{{comment.content}}</div>
                  </a>
                  <v-list-tile-sub-title class="caption d-flex">
                    <a v-if="comment.authorurl.length" 
                      class="authorlink teal--text text--lighten-1" 
                      target="_blank" 
                      :href="comment.authorurl">
                      {{comment.author}}
                    </a>
                    <span v-else 
                      class="authorlink">
                      {{comment.author}}
                    </span>
                    <v-spacer />
                    <timeago 
                      :datetime="comment.postdate" 
                      :autoUpdate="60" 
                      class="text-xs-right"
                    />
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-card>    
  </v-flex>
</template>

<style lang="less" scoped>
.authorlink {
  text-decoration: none;
}
.comment {
  font-size: 0.95rem;
  line-height: 1.3;
}
.commentlink {
  text-decoration: none;
  color: rgba(0,0,0,.87);
  &:hover {
    color: #4A148C; // purple darken-4
  }
}
</style>