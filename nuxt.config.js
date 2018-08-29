if (process.server) require('dotenv-safe').load();

const fs = require('fs');
const nodeExternals = require('webpack-node-externals')
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
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Courgette:400|Oswald:400' }
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
    '~/plugins/vue-timeago'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/feed',
    '@nuxtjs/font-awesome',
    '@nuxtjs/sitemap',
    '@nuxtjs/toast',
    '@nuxtjs/vuetify'
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
    duration: 2000,
    iconPack: 'fontawesome',
    position: 'top-center',
    theme: 'primary'
  },
  vuetify: {
    theme: {
      primary: '#720d5d',
      secondary: '#e30425',
      accent: '#4e0d3a'      
    }
  },
  generate: {
    routes
  },
  build: {
    extractCSS: true,
    extend(config, { isDev, isClient, isServer }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
      if (isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ]
      }      
    },
    transpile: [/^vuetify/],
    vendor: []
  }
}
