/**
 * Calculates a cutoff date, going back from Now, and returns a date string
 * @param {string} timespan e.g. D90 = 90 days, Y3 = 3 Years, * = max  
 * @returns {string} 'YYYY-MM-DD hh:mm'
 */
import { format } from 'date-fns';

export const getCutoffDate = timespan => {
  let code = timespan[0].toUpperCase();
  if (code === 'F') return '1970-01-01 01:01';

  let span = Number(timespan.substr(1)), days;
  switch (timespan[0].toUpperCase()) {
    case 'D': days = span; break;
    case 'M': days = span * 30; break;
    case 'Y': days = span * 365; break;
  }
  let date = new Date(Date.now() - days * 1000 * 60 * 60 * 24);
  return format(date, 'YYYY-MM-DD HH:mm');
};

/**
 * Sorts a given posts array descending by the value of a certain counterType (reads|hearts|comments)
 * @param {array} posts each post object has a prop "counter": { reads: 30, hearts: 2, comments: 5}
 * @param {string} counterType the type of counter used for sorting: reads|hearts|comments
 */
export const sortDescByCounterType = (posts, counterType) => {
  return posts.sort( (a,b) => {
    return b.counter[counterType] - a.counter[counterType];
  });
}