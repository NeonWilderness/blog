if (process.server) require('dotenv-safe').load();

const fs = require('fs');
const path = require('path');
const routes = require('./routes.config');

/**
 * Create JSON file of all available background images in folder static/img/bg/thumbs
 */
let backgrounds = fs.readdirSync(path.resolve(process.cwd(), 'static/img/bg/thumbs/')).sort();
fs.writeFileSync(
  path.resolve(process.cwd(), 'static/json/allBackgrounds.json'),
  JSON.stringify(backgrounds)
);

/**
 * Define script config differences between dev/prod mode
 */
// define common scripts valid for BOTH dev and prod mode
let commonScripts = [
];

// define/add scripts valid for DEV mode only
let devScripts = [
  ...commonScripts
];

// define/add scripts valid for PROD mode (build/generate) only
let prodScripts = [
  ...commonScripts,
  { src: '/js/statinit.js' },
  { src: 'https://www.statcounter.com/counter/counter.js', async: 'true' }
];

/**
 * Define baseUrl to serve as axios and sitemap option
 */
const baseUrl = (process.env.npm_lifecycle_event !== 'dev' ? process.env.BASEURL : 'http://localhost:3000');

module.exports = {
  css: [
    '~/assets/styles.less'
  ],
  head: {
    title: 'In a neon wilderness',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'In A Neon Wilderness: Blogging about urban hymns and bitter-sweet symphonies' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.jpg' },
      { 
        rel: 'stylesheet', 
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Courgette:400|Oswald:400|Material+Icons'
      }
    ],
    script: (process.env.npm_lifecycle_event !== 'dev' ? prodScripts : devScripts)
  },
  env: {
    apiUrl: process.env.APIURL,
    apiKey: process.env.APIKEY,
    baseUrl: baseUrl
  },
  loading: { color: '#3B8070' },
  plugins: [
    '~/plugins/vue-cockpit',
    '~/plugins/vue-timeago',
    '~/plugins/vuetify.js'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/feed',
    '@nuxtjs/font-awesome',
    '@nuxtjs/sitemap',
    '@nuxtjs/toast'
  ],
  axios: {
    baseURL: baseUrl
  },
  /*  feed: [
      {
        path: '/feed.xml',
        async create (feed) {},
        cacheTime: 1000 * 60 * 15,
        type: 'rss2' // rss2 | atom1 | json1
      }
    ], */
  sitemap: {
      cacheTime: 1000 * 60 * 15,
      exclude: [],
      generate: true,
      gzip: true,
      hostname: baseUrl,
      path: '/sitemap.xml',
      routes
  },
  toast: {
    duration: 4000,
    iconPack: 'fontawesome',
    position: 'top-center',
    theme: 'primary'
  },
  generate: {
    routes
  },
  build: {
    vendor: [
      '~/plugins/vuetify.js'
    ],
    extractCSS: true,
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.resolve.alias["vue"] = "vue/dist/vue.common"; // enable with-compiler Vue.js version
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    }
  }
}
