/**
 * Change foundation5 alert-box to vuetify standard (v-alert)
 * @param {object} story story object
 * @param {object} authors lookup user => url
 */
const convertAuthorUrl = (story, authors) => {

  // update story author
  story.fm.url = authors[story.fm.author] || '';
  // update all comment authors
  story.comments.forEach( comment => {
    comment.url = authors[comment.author] || '';
  });
  
};

module.exports = convertAuthorUrl;
