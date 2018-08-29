<template>
  <v-flex xs12 mt-3>
    <v-toolbar color="purple darken-1" dark>
      <v-toolbar-title>Lucky Man</v-toolbar-title>
    </v-toolbar>    
    <v-card>
      <v-layout row wrap>
        <v-flex xs12>
          <v-list three-line>
            <template v-for="(software, index) in twodaySoftware">
              <v-divider :inset="true" :key="index" v-if="index>0"></v-divider>
              <v-list-tile avatar :key="software.basename" :to="software.basename">
                <v-list-tile-avatar><img :src="'/img/icons/' + software.icon"></v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{software.text}}</v-list-tile-title>
                  <div class="caption description">{{software.desc}}</div>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-card>    
  </v-flex>
</template>

<script>
export default {
  data: function() {
    return {
      twodaySoftware: [
        {
          text: 'Alien-Tool',
          desc: 'Nutze Twoday als Hülle für deinen neuen Blog bei Wordpress, Blogspot etc.',
          icon: 'alien.png',
          basename: '/alien-inside-twoday-1022653371'
        },
        {
          text: 'Blog-Export-Tool',
          desc: 'Exportiere Twoday-Blogs sicher und in validem Movable-Type-Format',
          icon: 'blogexport.jpg',
          basename: '/blog-export-on-steroids-1022222314'
        },
        {
          text: 'Videoload2-Tool',
          desc: 'Zeige Videos, Musikclips und andere Dienste von über 20 Anbietern',
          icon: 'videoload2.jpg',
          basename: '/videoload2-1022598270'
        }
      ]
    };
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.description {
  line-height: 1.4;
}
</style>

