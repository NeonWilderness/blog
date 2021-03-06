<template>
  <v-app>
    <div id="wrapper" class="overflow-hidden" 
      :class="{faded: $store.state.isImgLoading}" 
    >
      <h1 class="sitetitle">In a neon wilderness <span>he was restless</span></h1>
      <h3 class="reborn hidden-sm-and-down">Redesigned.<br>Redefined.<br>Reborn.</h3>
      <v-container fluid grid-list-md style="padding:0">
        <nuxt/>
        <transition name="goTopBtn-fade">
          <v-btn
            @click="goToTop"
            bottom
            color="secondary"
            dark
            fab
            fixed
            right
            ripple
            v-show="$store.getters.isGoToTopButtonVisible"
          >
            <v-icon class="d-inline-flex">fa-chevron-up fa-lg</v-icon>
          </v-btn>
        </transition>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import { escape } from 'escape-goat';

const prefDefaults = {
  bgImage: 0,
  postsPerPage: 6,
  storyLayout: 'double',
  rememberGravatar: true
};

export default {
  data: function() {
    return {};
  },
  methods: {
    goToTop: function() {
      let el = document.getElementById('wrapper');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    validateCredentials: function(creds) { 
      Object.keys(creds).forEach(prop => {
        creds[prop] = escape(creds[prop]);
      });
      return creds;
    },
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
      prefs.rememberGravatar = !!prefs.rememberGravatar;

      return prefs;
    }
  },
  mounted: function() {
    let preferences = localStorage.getItem(this.$store.state.preferencesKey);
    this.$store.dispatch(
      'setPreferences',
      preferences
        ? this.validatePreferences(JSON.parse(preferences))
        : prefDefaults
    )
    .then( () => {
      if (this.$store.state.rememberGravatar) {
        let credentials = localStorage.getItem(this.$store.state.credentialsKey);
        if (credentials) 
          this.$store.commit(
            'setCredentials', 
            this.validateCredentials(JSON.parse(credentials))
          );
      }
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
  opacity: 1;
  position: relative;
  text-align: center;
  transition: 1.5s opacity;
  width: 100%;
  &.faded {
    opacity: 0;
    transition: none;
  }
  h1.sitetitle {
    position: absolute;
    top: 0;
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
    z-index: 1;
    span {
      display: inline-block;
      font-size: 0.6em;
      opacity: 0.6;
    }
  }
  h3.reborn {
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
    z-index: 2;
  }
  .goTopBtn-fade-enter-active, .goTopBtn-fade-leave-active {
    transition: opacity 1s;
  }
  .goTopBtn-fade-enter, .goTopBtn-fade-leave-to {
    opacity: 0;
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
  //transform: translateY(-5%);
  font-size: 20px!important;
  line-height: 24px;
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
  &.tiny {
    width: 24px!important;
    height: 24px!important;
  }
  &.inline {
    border-radius: 50%;
    display: inline-block;
    text-align: center;
  }
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
.round {
  border-radius: 8px;
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
.v-chip--small {
    height: 1.3rem;
    margin: 0 .2rem;
}
.v-chip, .v-btn {
  .v-icon {
    display: inline-flex;
    font-size: 14px;
    text-align: center;
    width: 1.5em;
  }
}
.v-expansion-panel__header, .v-toolbar {
  .v-icon {
    font-size: 14px;
  }
}
</style>
