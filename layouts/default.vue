<template>
  <v-app>
    <div id="wrapper" :class="{faded: $store.state.isImgLoading}" :style="{backgroundImage: 'url('+ $store.state.bgImage +')'}">
      <v-container fluid grid-list-md style="padding:0">
        <nuxt/>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import { escape } from 'escape-goat';

const prefDefaults = {
  bgImage: 0,
  postsPerPage: 4,
  storyLayout: 'single'
};

export default {
  data: function() {
    return {};
  },
  methods: {
    validatePreferences: function(prefs) {
      prefs.bgImage = prefs.bgImage || prefDefaults.bgImage;
      if (typeof prefs.bgImage === 'string')
        prefs.bgImage = escape(prefs.bgImage);

      if (isNaN(prefs.postsPerPage || prefDefaults.postsPerPage))
        prefs.postsPerPage = prefDefaults.postsPerPage; // use default if not a number
      else  
        prefs.postsPerPage = Math.max(Math.min(Number(prefs.postsPerPage), 12), 1);

      prefs.storyLayout = escape(prefs.storyLayout);
      if (!this.$store.getters.isValidLayoutID(prefs.storyLayout)) {
        prefs.storyLayout = prefDefaults.storyLayout;
        this.$toast.error(
          'Ungültiger Layoutparameter. Verwende Standardeinstellung.',
          { icon: 'fa-flash' }
        );
      }

      return prefs;
    }
  },
  mounted: function() {
    this.$axios.get('/json/allBackgrounds.json').then(res => {
      this.$store.commit('setBackgroundImages', res.data);

      let preferences = localStorage.getItem(this.$store.getters.getPreferencesKey);
      this.$store.dispatch(
        'setPreferences',
        preferences
          ? this.validatePreferences(JSON.parse(preferences))
          : prefDefaults
      );
    });

    this.$axios.get('/json/allCategories.json').then(res => {
      this.$store.commit('setCategories', res.data);
    });

    this.$axios.get('/json/mostRecentComments.json').then(res => {
      this.$store.commit('setMostRecentComments', res.data);
    });

  }
};
</script>


<style lang="less">
html {
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

#wrapper {
  background-attachment: fixed;
  background-color: #333;
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  opacity: 1;
  transition: 1.5s opacity;
  width: 100%;
  &.faded {
    opacity: 0;
    transition: none;
  }
}
label {
    color: #4d4d4d;
    cursor: pointer;
    display: block;
    font-size: 0.875rem;
    font-weight: normal;
    line-height: 1.5;
    margin-bottom: 0;
}
.adjust-fa .fa {
  transform: translateY(-5%);
}
.application--wrap {
  background-color: #212121;
  background-image: url(/img/overlay.png);
  background-repeat: repeat;
}
.carousel-caption {
    align-items: center;
    background: rgba(0,0,0,0.5);
    color: #fff;
    display: flex;
    height: 50px;
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1;
}
.clearfix
  &:before, &:after {
    content: " ";
    display: table;
  &:after {
    clear: both;
  }  
}
.dense {
  .v-list__tile {
    height: 36px;
  }
}
.fa-li {
  margin-right: .5em;
  margin-top: .1em;
}
.pricing-table {
  border: solid 1px #ddd; 
  margin-bottom: 1.25rem;
  li { 
    list-style: none; 
    line-height: 1;
  }
  .description {
    background-color: #fff;
    border-bottom: dotted 1px #ddd;
    color: #777;
    font-size: 0.75rem;
    font-weight: normal;
    line-height: 1.4;
    padding: 0.9375rem;
    text-align: center;
  }
  .bullet-item {
    background-color: #fff; 
    border-bottom: dotted 1px #ddd; 
    color: #333; font-size: 0.875rem; 
    font-weight: normal; 
    padding: 0.9375rem; 
    text-align: center;
  }
  .price { 
    background-color: #f5f5f5; 
    font-size: 1rem; 
    font-weight: normal; 
    padding: 0.9375rem 1.25rem; 
    text-align: center;
  }
}
.radius {
  border-radius: 2px;
}
.tooltip {
  border-bottom: 1px dotted rgba(0, 0, 0, .87);
}
@keyframes blink {
    0%   {opacity: .1;}
    10%  {opacity: .2;}
    20%  {opacity: .4;}
    30%  {opacity: .6;}
    40%  {opacity: .8;}
    50%  {opacity: 1;}
    60%  {opacity: .8;}
    70%  {opacity: .6;}
    80%  {opacity: .4;}
    90%  {opacity: .2;}
    100% {opacity: .1;}
}
.v-alert>div>p:last-child {
  margin-bottom: 0;
}
</style>
