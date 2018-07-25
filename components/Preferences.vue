<template>
  <v-navigation-drawer absolute fixed light right temporary v-model="$store.state.isDrawerVisible">
    <v-toolbar color="blue lighten-3" dark flat>
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

    <v-subheader class="blue--text text--lighten-3">Layout Blogbeiträge</v-subheader>
    <div class="mx-3">
      <v-radio-group v-model="$store.state.storyLayout" mandatory class="mt-0">
        <v-radio
          v-for="layout in storyLayoutOptions"
          :class="layout.icon"
          :key="layout.val"
          :label="layout.text"
          :value="layout.val"
        ></v-radio>
      </v-radio-group>    
    </div>

    <v-subheader class="blue--text text--lighten-3">Hintergrundbild</v-subheader>
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
              @click="setCurrentBackgroundImage(index)">
            </div>
          </div>
        </v-flex>
      </v-layout>
    </div>
    <div class="btnSave">
      <v-btn color="secondary" ripple small @click="savePreferences">
        <v-icon left>fa-save</v-icon>Einstellungen sichern
      </v-btn>
      <v-alert :value="showMessage" type="success">Einstellungen gesichert!</v-alert>
    </div>

  </v-navigation-drawer>
</template>

<script>
export default {
  data: function() {
    return {
      showMessage: false,
      storyLayoutOptions: [
        { val: 'single', text: 'volle Breite', icon: 'icon stop' },
        { val: 'double', text: '2-spaltig', icon: 'icon pause' },
        { val: 'triple', text: 'Übersicht', icon: 'icon th' }
      ]
    };
  },
  methods: {
    isImageSelected(image, index) {
      let bgIndex = this.$store.getters.getBgIndex;
      if (bgIndex < 0) { // no image has been clicked yet (image is a default or based on preferences)
        return this.$store.getters.isCurrentBackgroundImage(image);
      } else { // an image was selected
        return bgIndex === index;
      }
    },
    savePreferences() {
      if (process.browser) {
        localStorage.setItem(this.$store.getters.getPreferencesKey, JSON.stringify({
          bgImage: (this.$store.getters.getBgIndex === 0 ? 0 : this.$store.getters.getCurrentBackgroundImage),
          storyLayout: this.$store.getters.getStoryLayout
        }));
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
          this.toggleDrawer();
        }, 1800);
      }
    },
    setCurrentBackgroundImage(index) {
      this.bgIndex = index;
      this.$store.commit('setCurrentBackgroundImage', index);
    },
    toggleDrawer() {
      this.$store.commit('toggleDrawer');
    }
  }
}
</script>

<style lang="less">
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
    border-color: #ff8f00;
  }
  &:hover {
    cursor: pointer;
    border-color: #ffb300;
  }
}
.btnSave {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 2rem;
}
.v-radio {
  &.icon label:before {
    font-family: 'FontAwesome';
    width: 2em;
    text-align: center;
  }
  &.stop label {
    &:before {
      content: '\f04d';
    }
  }
  &.pause label {
    &:before {
      content: '\f04c';
    }
  }
  &.th label {
    &:before {
      content: '\f00a';
    }
  }
}
</style>

