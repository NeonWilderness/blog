/**
 * Change foundation5 accordion to vuetify standard (v-expansion-panel)
 * @param {object} story story object
 * @param {cheerio} $ element/s to change
 * @param {log} $ logging instance
 * @param {number} commentIdx -1: story, >=0: index of actual comment 
 */
const convertExpansionPanel = (story, $, log, commentIdx = -1) => {

  log.set('accordion');

  $('.accComponent').each((index, el) => {
    let $el = $(el);
    let before = $.html(el);
    let data = [];

    let titles = $el.find('>.accHeadline').map((index, head) => $(head).find('>a').text());
    let contents = $el.find('>.accElement>.accContent').map((index, content) => $(content).html());

    if (titles.length !== contents.length) throw new Error('Accordion Error: different titles/contents count');

    let textColor = ($el.hasClass('accLight') ? '' : ' white--text');
    titles.each((index, title) => {
      data.push(
        `<v-expansion-panel-content ${textColor ? 'class="' + textColor.trim() + '" ' : ''}expand-icon="fa-chevron-down${textColor}" lazy="true" ripple="true">
           <div slot="header">${title}</div>
           <v-card>
             <v-card-text>${contents[index]}</v-card-text>
           </v-card>
         </v-expansion-panel-content>        
        `);
    });
    $el.html(`${data.join('')}`);
    delete el.attribs.class;
    el.tagName = 'v-expansion-panel';
    log.item(`${story.fm.basename}${commentIdx >= 0 ? ' comment #' + commentIdx : ''}`, before, $.html(el));
  });

};

module.exports = convertExpansionPanel;
