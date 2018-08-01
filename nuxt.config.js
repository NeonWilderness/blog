if (process.server) require('dotenv-safe').load();

/**
 * Define script config differences bewteen dev/prod mode
 */
// define common scripts valid for both dev and prod mode
let commonScripts = [
];

// define/add scripts valid for DEV mode only
let devScripts = [
  ...commonScripts
];

// define/add scripts valid for BUILD/GENERATE mode only
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
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Courgette:400|Roboto:400|Oswald:400' }
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
    '~/plugins/vue-timeago'
  ],
  modules: [
    '@nuxtjs/axios',
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
/*  sitemap: {
    cacheTime: 1000 * 60 * 15,
    exclude: [],
    generate: true,
    gzip: true,
    hostname: baseUrl,
    path: '/sitemap.xml',
    routes: require('./static/json/allRoutes.json')
  }, */
  toast: {
    duration: 2000,
    iconPack: 'fontawesome',
    position: 'top-center',
    theme: 'primary'
  },
  vuetify: {
    //  theme: {}
  },
  /*  generate: {
      routes: function () {
        return axios.get('https://my-api/users')
        .then(res => {
          return res.data.map(slug => `/${slug}`)
        })
      }
    }, */
  build: {
    extractCSS: true,
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
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
