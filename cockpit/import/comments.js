/**
 * Manages deletion and import of blog posts
 */
const { delayNextPromise, truncateCollection } = require('./shared');

const getPostId = (lookupPosts, basename) => {
  if (basename in lookupPosts)
    return lookupPosts[basename];
  else
    throw new Error(`Basename "${basename}" not found in postid lookup.`);
};

class Comment {

  constructor(comment, postid, parentid) {
    this.postid = postid;
    this.postdate = comment.date;
    this.author = comment.author.trim();
    this.authorurl = comment.url.trim().toLowerCase();
    this.email = '';
    this.reviewed = true;
    this.approved = true;
    this.content = comment.body.trim();
    this.parentid = parentid;
  }

}

const deleteComments = (Cockpit) => {
  return truncateCollection(Cockpit, 'comments');
};

const importComments = (Cockpit, stories, lookupPosts) => {
  const wait = 120; // ms
  let timeout = 0; // wait*index

  const recursiveCommentLayer = (comments, index, postid) => {
    let comment = new Comment(comments[index], postid, '');
    timeout += wait;
    delayNextPromise(timeout)
      .then(() => Cockpit.collectionSave('comments', comment))
      .then(entry => {
        let parentid = entry._id;
        let replies = [];
        index++;
        while (index < comments.length && comments[index].type === 'R') {
          let reply = new Comment(comments[index], postid, parentid);
          timeout += wait;
          replies.push(
            delayNextPromise(timeout)
              .then(() => Cockpit.collectionSave('comments', reply))
          );
          index++;
        }
        Promise.all(replies)
          .then(result => {
            if (index < comments.length) recursiveCommentLayer(comments, index, postid);
          })
          .catch(err => {
            console.error(`Saving replies of ${JSON.stringify(comment)} failed with error: ${err}.`);
            throw err;
          });
      })
      .catch(err => {
        console.error(`Saving comment ${JSON.stringify(comment)} failed with error: ${err}.`);
        throw err;
      });
  };

  stories.forEach((story, index) => {
    if (story.fm.basename in lookupPosts && story.comments.length) {
      let postid = getPostId(lookupPosts, story.fm.basename);
      recursiveCommentLayer(story.comments, 0, postid);
    }
  });

};

module.exports = {
  deleteComments,
  importComments
};