/**
 * Assures a timeout before the next promise http call
 * @param {number} delay ms to wait
 */
const delayNextPromise = (delay => {
  return new Promise(resolve => setTimeout(resolve, delay));
});

/**
 * Truncates (=deletes all entries) of a cockpit collection
 * @param {object} Cockpit Cockpit Instance
 * @param {string} collectionName Collection Name, e.g. posts | categories
 */
const truncateCollection = (Cockpit, collectionName) => {
  return new Promise((resolve, reject) => {
    Cockpit.collection(collectionName).get((data) => {
      let total = data.total;
      Promise.all(
        data.entries.reduce((all, entry, index) => {
          all.push(Cockpit.collectionRemove(collectionName, { _id: entry._id }));
          return all;
        }, [])
      ).then(() => {
        Cockpit.collection(collectionName).get((data) => {
          if (data.total === 0) {
            if (total === 0)
              console.info(`Collection "${collectionName}" already empty. Nothing to delete!`);
            else
              console.info(`Collection "${collectionName}" truncated. ${total} entries successfully deleted.`);
            resolve();
          } else {
            console.error(`${data.total} of ${total} entries NOT deleted in collection "${collectionName}".`);
            reject();
          }
        });
      })
        .catch((err) => {
          console.log(`Truncating collection "${collectionName}" failed with error: {err}.`);
          reject();
        });
    });
  });

};

module.exports = {
  delayNextPromise,
  truncateCollection
};