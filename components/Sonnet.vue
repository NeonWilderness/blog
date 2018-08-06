<template>
  <v-flex xs12 mt-3>
    <v-toolbar color="purple darken-1" dark>
      <v-toolbar-title>Sonnet</v-toolbar-title>
    </v-toolbar>
    <v-expansion-panel>
      <v-expansion-panel-content>
        <div slot="header" class="teal--text text--lighten-1">Topics</div>
        <Categories />
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header" class="teal--text text--lighten-1">Most read</div>
        <Most target="reads" />
      </v-expansion-panel-content>
      <v-expansion-panel-content v-if="isThisTypeActive('hearts')">
        <div slot="header" class="teal--text text--lighten-1">Most hearted</div>
        <Most target="hearts" />
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header" class="teal--text text--lighten-1">Most commented</div>
        <Most target="comments" />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-flex>
</template>

<script>
import Categories from "~/components/Categories.vue";
import Most from "~/components/Most.vue";

export default {
  components: {
    Categories,
    Most
  },
  methods: {
    isThisTypeActive: function(type) {
      return (type in this.$store.state.most);
    }
  }
}
</script>


<style lang="less" scoped>
</style>

