/**
 * Convert blog post content from Twoday's non-HTML5-style to true HTML5
 */
const cheerio = require('cheerio');

const convertStories = (stories) => {

  stories.forEach((story) => {

    let $ = cheerio.load(`<div>${story.body.content}</div>`, { decodeEntities: false });

    // fix/change some classes to either foundation5 standard or font awesome icon defs
    let classFixes = [
      { from: 'aligncenter', to: 'text-center' },
      { from: 'alignright', to: 'text-right' },
      { from: 'icon-th-list', to: 'fa fa-th-list' },
      { from: 'icon-rocket', to: 'fa fa-rocket' },
      { from: 'icon-quote-left', to: 'fa fa-quote-left' },
      { from: 'icon-2x', to: 'fa-2x' },
      { from: 'muted', to: '' },
      { from: 'neonrounded', to: 'alert-box success radius' }
    ];
    for (let fix of classFixes) {
      $(`.${fix.from}`).each((index, el) => {
        let $el = $(el);
        let cls = el.attribs.class;
        if (fix.to.length)
          $el.toggleClass(`${fix.from} ${fix.to}`);
        else
          $el.removeClass(`${fix.from}`);
        console.log(`"${story.fm.basename}" -->Changed: "${cls}" to "${el.attribs.class}".`);
      });
    }

    // change data-commands, previously hidden in the title text to now be a valid data-attribute
    $('[title^="data-"]').each((i, el) => {
      let $el = $(el);
      let oldTitle = $el.attr('title');
      $el.removeAttr('title');
      oldTitle.split('|').forEach((cmd) => {
        cmd = cmd.trim();
        let parts = cmd.split('=');
        if (parts.length > 1)
          $el.attr(parts[0].replace('data-!', ''), `${parts[1]}`);
        else
          $el.attr(parts[0], '');
      });
      console.log(
        `"${story.fm.basename}" -->Changed attribs from: "${oldTitle}" to =>`,
        Object.keys(el.attribs).reduce((all, attr) => {
          let val = $el.attr(attr);
          all += `${attr}${val.length ? '="' + val + '"' : ''} `;
          return all;
        }, ''));
    });

    // change tipsy tooltip (a-tag) to foundation standard (span-tag)
    $('a.tip').each((index, el) => {
      let $el = $(el);
      let tipsy = $.html(el);
      $el.toggleClass('tip has-tip')
        .attr('data-tooltip', '')
        .attr('aria-haspopup', 'true')
        .removeAttr('rel');
      el.tagName = 'span';
      console.log(`"${story.fm.basename}" -->Changed tooltip: "${tipsy}" to "${$.html(el)}".`);
    });

    story.body.content = $('div').html();

    // append style defs for .neonhand class (handwriting text style)
    if ($('.neonhand').length > 0) {
      story.body.content += `
    <style>
    @import url('https://fonts.googleapis.com/css?family=Nothing+You+Could+Do');
    .neonhand{font-family:'Nothing You Could Do',cursive; font-size:1.5em; line-height:1.5em;}
    </style>`;
    console.log(`"${story.fm.basename}" -->Added neonhand-style.`);
  }

  });

};

module.exports = {
  convertStories
};