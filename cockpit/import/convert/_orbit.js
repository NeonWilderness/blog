/**
 * Change foundation5 orbit-container to vuetify standard (v-carousel)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 */
const convertPanel = (story, $, log) => {

  $('.orbit-container').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    let data = [];
    $el.find('li').each((lix, li) => {
      $li = $(li);
      data.push(
       `<v-carousel-item src="/cockpit/storage/uploads/images/${$li.find('img').eq(0).attr('alt')}">
			    <div class="carousel-caption">${$li.find('.orbit-caption').eq(0).text()}</div>
		    </v-carousel-item>        
       `);
    });
    el.tagName = 'v-carousel';
    $el.html(`${data.join('')}`);
    log.item(story.fm.basename, before, $.html(el));
  });

};

module.exports = convertPanel;
