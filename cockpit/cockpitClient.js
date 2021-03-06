/**
 * Read Cockpit CMS data for nuxt blog (client-side)
 * =================================================
 * 
 */
import _merge from 'lodash.merge';

class Cockpit {

  constructor({ host, token, axios }) {
    this.host = host;
    this.token = token;
    this.axios = axios;
    // need to bind "this" to class methods
    this.readCollection = this.readCollection.bind(this);
    this.readPosts = this.readPosts.bind(this);
    this.readCategories = this.readCategories.bind(this);
    this.readComments = this.readComments.bind(this);
    this.saveCollection = this.saveCollection.bind(this);
  }

  readCollection(collection, options) {
    return this.axios.post(
      `${this.host}/api/collections/get/${collection}`,
      _merge(options, { token: this.token })
    )
      .then(res => {
        if ('dump' in options && options.dump) console.log(JSON.stringify(res.data, null, 2));
        return res.data.entries;
      })
      .catch(err => {
        console.log(`readCollection "${collection}" ended with error: ${err}`);
      });
  };

  readPosts(options) {
    return this.readCollection('posts', _merge({
      filter: { published: true },
      populate: 1,
      sort: { date: -1 } // descending: newest on top
    }, options || {}));
  };

  readCategories(options) {
    return this.readCollection('categories', _merge({
      sort: { category: 1 } // ascending
    }, options || {}));
  };

  readComments(options) {
    return this.readCollection('comments', _merge({
      sort: { postdate: -1 } // descending by postdate (standard for latest comments view)
    }, options || {}));
  };

  saveCollection(collection, options) {
    if ('dump' in options && options.dump) console.log('options:', JSON.stringify(options, null, 2));
    return this.axios.post(
      `${this.host}/api/collections/save/${collection}`,
      _merge(options, { token: this.token })
    )
      .then(entry => {
        if ('dump' in options && options.dump) console.log('entry:', JSON.stringify(entry, null, 2));
        return entry;
      })
      .catch(err => {
        console.log(`saveCollection "${collection}" ended with error: ${err}`);
      });
  };

}

export default Cockpit;