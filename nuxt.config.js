require('dotenv-safe').load();

/**
 * Create JSON file of all available background images in folder static/img/bg/
 */
const fs = require('fs');
fs.writeFileSync(
  './static/img/backgrounds.json', 
  JSON.stringify(fs.readdirSync('./static/img/bg/thumbs/').sort())
);

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
  loading: { color: '#3B8070' },
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
    routes: [
      '/page/1',
      {
        url: '/page/2',
        changefreq: 'daily',
        priority: 1,
        lastmodISO: '2017-06-30T13:30:00.000Z'
      }
    ]
  }, */
  toast: {
    duration : 2000,
    iconPack : 'fontawesome',
    position: 'top-center', 
    theme: 'primary' 
  },
  vuetify: { 
    //  theme: {}
  },
/*  generate: {
    routes: function () {
      return axios.get('https://my-api/users')
      .then((res) => {
        return res.data.map((slug) => {
          return `/${slug}`
        })
      })
    }
  }, */
  build: {
    extractCSS: true,
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
