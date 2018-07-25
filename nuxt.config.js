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
 * Create JSON file of all available background images in folder static/img/bg/
 */
const fs = require('fs');
fs.writeFileSync('./static/img/backgrounds.json', JSON.stringify(fs.readdirSync('./static/img/bg/')));

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
    '@nuxtjs/font-awesome',
    '@nuxtjs/vuetify'
  ],
  axios: {
  },
  vuetify: { 
    //  theme: {}
  },
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
