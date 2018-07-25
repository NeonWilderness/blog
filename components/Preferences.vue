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
      <v-radio-group v-model="storyLayout" mandatory class="mt-0">
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
          v-for="(image, index) in $store.getters.getBackgroundImages">
          <div class="bgWrap">
            <div class="bgImage"
              :class="{'selected': $store.getters.isCurrentBackgroundImage(image)}" 
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
      storyLayout: null,
      storyLayoutOptions: [
        { val: 'single', text: 'volle Breite', icon: 'icon stop' },
        { val: 'double', text: '2-spaltig', icon: 'icon pause' },
        { val: 'triple', text: 'Übersicht', icon: 'icon th' }
      ]
    };
  },
  methods: {
    savePreferences() {
      if (process.browser) {
        localStorage.setItem('neonStoryLayout', this.storyLayout);
        localStorage.setItem('neonBackgroundImage', this.$store.getters.getCurrentBackgroundImage);
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
          this.toggleDrawer();
        }, 2000);
      }
    },
    setCurrentBackgroundImage(index) {
      this.$store.commit('setCurrentBackgroundImage', index);
    },
    toggleDrawer() {
      this.$store.commit('toggleDrawer');
    }
  },
  created: function() {
    if (process.browser) {
      this.storyLayout = localStorage.getItem('neonStoryLayout') || this.storyLayoutOptions[0].val;
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

