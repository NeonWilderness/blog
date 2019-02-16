<template>
  <v-navigation-drawer absolute fixed light right temporary v-model="$store.state.isDrawerVisible">
    <v-toolbar color="cyan" dark flat>
      <v-list>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title class="title adjust-fa"><v-icon>fa-cog</v-icon>&ensp;Einstellungen</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon @click.stop="toggleDrawer">
              <v-icon>fa-times fa-lg</v-icon>
            </v-btn>
          </v-list-tile-action>          
        </v-list-tile>
      </v-list>
    </v-toolbar>

    <v-divider></v-divider>

    <v-subheader class="cyan--text text--darken-1">Layout Blogbeiträge</v-subheader>
    <div class="pb-4">
      <v-chip 
        @click="$store.commit('setStoryLayout', storyLayoutOptions[index].val)"
        class="layoutOption"
        :color="chipColor(index)" 
        dark 
        :selected="isChipSelected(index)"
        text-color="white"
        v-for="(layout, index) in storyLayoutOptions"
        :key="index"
      >
      <v-avatar class="mr-0">
          <v-icon>{{layout.icon}}</v-icon>
        </v-avatar>    
        {{layout.text}}
      </v-chip>
    </div>
    <v-flex xs12 class="mx-3">
      <v-slider v-model="$store.state.postsPerPage"
        @input="adaptPage"
        always-dirty 
        color="cyan darken-1"
        label="Beiträge je Seite" 
        thumb-label="always"
        :min="1" 
        :max="12" 
        :step="1">
      </v-slider>
    </v-flex>
    <v-flex xs12 class="mx-3">
      <div class="d-flex">
        <v-switch 
          class="mt-0"
          color="cyan darken-1"
          label="Gravatar-Daten merken?" 
          v-model="$store.state.rememberGravatar"
        ></v-switch>
        <div class="subheading mt-1 cyan--text text--darken-1">
          {{$store.state.rememberGravatar ? 'ja' : 'nein'}}
        </div>
      </div>
    </v-flex>  

    <v-subheader class="cyan--text text--darken-1">Hintergrundbild</v-subheader>
    <div class="mx-3">
      <v-layout row wrap>
        <v-flex 
          xs6 
          :key="index" 
          v-for="(image, index) in $store.getters.getThumbsImages">
          <div class="bgWrap">
            <div class="bgImage"
              :class="{'selected': isImageSelected(image, index)}" 
              :style="{backgroundImage: `url(${image})`}" 
              @click.stop="setCurrentBackgroundImage(index)">
            </div>
          </div>
        </v-flex>
      </v-layout>
    </div>
    <div class="btnSave">
      <v-btn color="secondary" ripple small @click.stop="savePreferences">
        <v-icon left small>fa-save</v-icon>Einstellungen sichern&nbsp;
      </v-btn>
    </div>

  </v-navigation-drawer>
</template>

<script>
export default {
  data: function() {
    return {
      storyLayoutOptions: [
        { val: 'single', text: 'volle Breite', icon: 'fa-stop' },
        { val: 'double', text: '2-spaltig', icon: 'fa-pause' },
        { val: 'triple', text: 'Übersicht', icon: 'fa-th' }
      ]
    };
  },
  methods: {
    adaptPage: function(perPage) {
      this.$store.commit('setPostsPerPage', perPage);
      this.$store.commit('setMaxPage');
      this.$emit('adaptPostsPerPage');
    },
  	chipColor: function(index) {
    	return (this.isChipSelected(index) ? 'teal lighten-1' : 'cyan') 
    },
    isChipSelected: function(index) {
    	return this.storyLayoutOptions[index].val === this.$store.state.storyLayout;
    },
    isImageSelected(image, index) {
      let bgIndex = this.$store.state.bgIndex;
      if (bgIndex < 0) { // no image has been clicked yet (image is a default or based on preferences)
        return index === 0;
      } else { // an image was selected
        return bgIndex === index;
      }
    },
    savePreferences(e) {
      e.currentTarget.disabled = true;
      localStorage.setItem(this.$store.state.preferencesKey, JSON.stringify({
        bgImage: (this.$store.state.bgIndex === 0 ? 0 : this.$store.state.bgImage),
        postsPerPage: this.$store.state.postsPerPage,
        storyLayout: this.$store.state.storyLayout,
        rememberGravatar: this.$store.state.rememberGravatar
      }));
      if (!this.$store.state.rememberGravatar) {
        localStorage.removeItem(this.$store.state.credentialsKey);
        this.$store.commit('setCredentials', { email: '', name: '', url: '' });
      }
      this.toggleDrawer();
      this.$toast.success('Einstellungen erfolgreich gesichert.', {icon: 'fa-check'});
      e.currentTarget.disabled = false;
    },
    setCurrentBackgroundImage(index) {
      this.$store.dispatch('setCurrentBackgroundImage', index);
    },
    toggleDrawer() {
      this.$store.commit('toggleDrawer');
    }
  }
}
</script>

<style lang="less" scoped>
.bgWrap {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
}
.bgImage {
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;  
  border: 4px solid #fff;
  position: absolute;
  transition: all 400ms ease-out;
  width: 100%;
  height: 100%;
  &.selected {
    border-color: #00ACC1; // #ff8f00;
  }
  &:hover {
    cursor: pointer;
    border-color: #26C6DA; // #ffb300;
  }
}
.btnSave {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style>
<style lang="less">
.v-radio {
  .v-icon {
    vertical-align: sub;
  }
  &.icon label:before {
    font-family: 'FontAwesome';
    width: 2em;
    text-align: center;
  }
  &.icon-stop label:before {
      content: '\f04d';
  }
  &.icon-pause label:before {
      content: '\f04c';
  }
  &.icon-th label:before {
      content: '\f00a';
  }
}
</style>