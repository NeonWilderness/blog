import Vue from 'vue';
import VueTimeago from 'vue-timeago';

Vue.use(VueTimeago, {
  name: 'Timeago', // Component name, `Timeago` by default
  locale: 'de', // Default locale
  locales: {
    'de': require('date-fns/locale/de')
  }
});