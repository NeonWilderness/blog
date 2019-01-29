<template>
  <v-flex xs12>
    <v-card elevation="0">
      <v-layout row wrap>
        <v-flex xs6 offset-xs3>
          <v-select :items="$store.state.selectPeriods" 
            v-model="$store.state.selectedPeriod"
            item-text="text" 
            item-value="value"
            label="Zeitspanne">
          </v-select>
        </v-flex>
        <v-flex xs12>
          <v-list subheader three-line>
            <v-list-tile 
              v-for="(post, index) in getMost"
              :key="post._id"
              :to="`/${post.basename}/`">
              <v-list-tile-avatar>
                <v-btn fab dark small color="teal lighten-1">{{index + 1}}</v-btn>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <div class="body-2 mb-2 mostTitle">{{post.title}}</div>
                <v-list-tile-sub-title class="caption d-flex">
                  <timeago :datetime="post.date" :autoUpdate="60"></timeago>
                  <v-spacer />
                  <span class="text-xs-right">
                    <v-icon class="mostIcon">{{mostIcon[target]}}</v-icon>&nbsp;{{post.counter[target]}}
                  </span>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-flex>
      </v-layout>
    </v-card>    
  </v-flex>
</template>

<script>
export default {
  props: {
    target: {
      type: String,
      required: true,
      validator: value => {
        return ['reads', 'hearts', 'comments'].indexOf(value) >= 0;
      }
    }
  },
  data: function() {
    return {
      mostIcon: {
        reads: 'fa-eye',
        hearts: 'fa-heart-o',
        comments: 'fa-comments-o'
      }
    };
  },
  computed: {
    getMost: function() {
      return this.$store.getters.getMost(this.target);
    }
  }
}
</script>

<style lang="less" scoped>
.mostTitle {
  line-height: 1.3;
  letter-spacing: 0.02em;
}
.mostIcon {
  line-height: 1.1!important;
}
</style>