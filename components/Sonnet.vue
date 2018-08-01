<template>
  <v-flex xs12 mt-3>
    <v-toolbar color="purple darken-1" dark>
      <v-toolbar-title>Sonnet</v-toolbar-title>
    </v-toolbar>
    <v-expansion-panel>
      <v-expansion-panel-content>
        <div slot="header" class="purple--text text--lighten-2">Topics</div>
        <Categories />
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header">Tags</div>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header">Most read</div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-flex>
</template>

<script>
import Categories from "~/components/Categories.vue";

export default {
  components: {
    Categories
  }
}
</script>


<style lang="less">
</style>

