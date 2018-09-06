<template>
  <v-flex xs12>
    <v-card>
      <v-layout row wrap>
        <v-flex xs12>
          <v-list subheader>
            <v-list-tile v-for="category in $store.getters.getCategories"
              class="dense"
              :key="category._id"
              :to="'/topic/' + category.slug"
            >{{category.category}} ({{category.count}})
            </v-list-tile>
          </v-list>
        </v-flex>
      </v-layout>
    </v-card>    
  </v-flex>
</template>

<style lang="less" scoped>
</style>

