if (process.server) require('dotenv-safe').load();
const cheerio = require('cheerio');
const cockpit = require('./cockpit/cockpit');
const ellipsize = require('ellipsize');

module.exports = [
  {
    path: '/feed.xml',
    async create (feed) {

      feed.options = {
        title: 'In A Neon Wilderness',
        link: `${process.env.BASEURL}`,
        feed: `${process.env.BASEURL}/feed.xml`,
        description: 'Blogging about urban hymns and bitter-sweet symphonies',
        image: `${process.env.BASEURL}/img/nw.png`,
        generator: '@nuxtjs/feed',
        copyright: `(C) 2006-${new Date().getFullYear()} NeonWilderness`,
        attr: {
          'xmlns:slash': 'http://purl.org/rss/1.0/modules/slash/' // needs feed modification
        }
      };

      const latestPosts = await cockpit.readPosts({ limit: 20, skip: 0 });
      latestPosts.forEach(post => {
        let $ = cheerio.load(`<div>${post.content}</div>`, { xmlMode: true, decodeEntities: false });
        feed.addItem({
          title: post.title.toString(),
          link: `${process.env.BASEURL}/${post.basename}`,
          date: new Date(post.date),
          description: ellipsize($.text(), 300),
          content: post.content,
          comments: `${process.env.BASEURL}/${post.basename}#comments`,
          'slash\:comments': post.counter.comments,
          category: post.category.category
        });
      });
    
    },
    type: 'rss2'
  }
];