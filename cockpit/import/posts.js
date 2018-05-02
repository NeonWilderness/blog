/**
 * Manages deletion and import of blog posts
 */
const { truncateCollection } = require('./shared');

class Post {

  constructor(story) {
    this.published = (story.fm.status === 'publish');
    this.commentsallowed = (story.fm.allowcomments === '1');
    this.commentsclosed = false;
    this.date = story.fm.date;
    this.title = story.fm.title;
    this.category = {
      _id: '',
      link: 'categories',
      display: story.fm.category
    };
    this.image = null;
    this.content = story.body.content;
    this.basename = story.fm.basename;
    this.counter = {
      reads: story.body.reads,
      comments: story.comments.length,
      hearts: 0
    };
    this.tags = [];
  }

  setCategoryId(lookupCategories) {
    if (this.category.display in lookupCategories)
      this.category._id = lookupCategories[this.category.display];
    else
      console.error(`Category "${this.category.display}" not found in lookup @ basename ${this.basename}.`);
  }

}

const deletePosts = (Cockpit) => {
  return truncateCollection(Cockpit, 'posts');
};

const importPosts = (Cockpit, stories, lookupCategories, limit) => {

  let posts = stories.reduce((all, story, index) => {
    if (index < limit) {
      let post = new Post(story);
      post.setCategoryId(lookupCategories);
      all.push(Cockpit.collectionSave('posts', post));
    }
    return all;
  }, []);

  return Promise.all(posts);

};

module.exports = {
  deletePosts,
  importPosts
};