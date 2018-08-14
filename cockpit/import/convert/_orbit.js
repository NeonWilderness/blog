/**
 * Change foundation5 orbit-container to vuetify standard (v-carousel)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertPanel = (story, $, log, commentIdx = -1) => {

  log.set('orbit');

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
    $el
      .removeClass('orbit-container')
      .html(`${data.join('')}`);
    if (!el.attribs.class.length) delete el.attribs.class;      
    log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, before, $.html(el));
  });

};

module.exports = convertPanel;
