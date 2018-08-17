<template>
  <v-app>
    <div id="wrapper" :class="{faded: $store.state.isImgLoading}" :style="{backgroundImage: 'url('+ $store.state.bgImage +')'}">
      <h1>In a neon wilderness <span>he was restless</span></h1>
      <h3>Redesigned.<br>Redefined.<br>Reborn.</h3>
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
  position: relative;
  text-align: center;
  transition: 1.5s opacity;
  width: 100%;
  &.faded {
    opacity: 0;
    transition: none;
  }
  h1 {
    position: absolute;
    top: 2%;
    left: 0;
    background: rgba(21, 21, 21, 0.6);
    color: #fff;
    font-family: "Oswald";
    font-size: 2.75rem;
    font-weight: normal;
    opacity: 0.8;
    padding: 0.5em;
    width: 100%;
    word-spacing: 0;
    span {
      display: inline-block;
      font-size: 0.6em;
      opacity: 0.6;
    }
  }
  h3 {
    position: absolute;
    background: rgba(255, 255, 255, 0.6);
    font-family: "Courgette";
    font-size: 1.6875rem;
    font-weight: 300;
    top: 56px;
    left: -140px;
    width: 500px;
    padding: 0.4em;
    color: #df0025;
    transform: rotate(-45deg);
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
.clearfix {
  &:before, &:after {
    content: " ";
    display: table;
  }
  &:after {
    clear: both;
  }  
}
.dense {
  .v-list__tile {
    height: 36px;
  }
}
.d-flex > li {
  list-style-type: none;
}
.fa-li {
  margin-right: .5em;
  margin-top: .1em;
}
.neonimg {
    box-shadow: 8px 8px 16px rgba(0,0,0,0.6);
    margin: 16px 0;
}
.number {
  width: 30px!important;
  height: 30px!important;
  box-shadow: none!important;
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
  .title {
    background-color: #333;
    color: #eee;
    font-size: 1rem;
    padding: 0.9375rem 1.25rem;
    text-align: center;
  }
}
.radius {
  border-radius: 2px;
}
.th {
    border: solid 4px #fff;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.2);
    display: inline-block;
    line-height: 0;
    max-width: 100%;
    transition: all 200ms ease-out;
    &:hover, &:focus {
      box-shadow: 0 0 6px 1px rgba(0,140,186,0.5);
    }
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
/*.v-btn__content .fa {
  margin-right: .6125em;
}*/
.v-chip--small {
    height: 1.3rem;
    margin: 0 .2rem;
}
</style>
