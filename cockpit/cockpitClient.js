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
      filter: { reviewed: true, approved: true },
      sort: { postdate: -1 } // descending by postdate (standard for latest comments view)
    }, options || {}));
  };

  saveCollection(collection, options) {
    return this.axios.post(
      `${this.host}/api/collections/save/${collection}`,
      _merge(options, { token: this.token })
    )
      .then(entry => {
        if ('dump' in options && options.dump) console.log(JSON.stringify(entry, null, 2));
        return entry;
      })
      .catch(err => {
        console.log(`saveCollection "${collection}" ended with error: ${err}`);
      });
  };

}

export default Cockpit;