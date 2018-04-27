/**
 * Truncates (=deletes all entries) of a cockpit collection
 * @param {object} cockpit Cockpit Instance
 * @param {string} collectionName Collection Name, e.g. posts | categories
 */
const truncateCollection = (cockpit, collectionName) => {
  return new Promise( (resolve, reject) => {
    cockpit.collection(collectionName).get((data) => {
      let total = data.total;
      Promise.all(
        data.entries.reduce((all, entry, index) => {
          all.push(cockpit.collectionRemove(collectionName, { _id: entry._id }));
          return all;
        }, [])
      ).then(() => {
        cockpit.collection(collectionName).get((data) => {
          if (data.total === 0) {
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
  truncateCollection
};