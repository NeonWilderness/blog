require('dotenv-safe').load();
const baseUrl = process.env.BASEURL.substr(process.env.BASEURL.indexOf('://') + 1);

/**
 * Replace some urls/strings
 * @param {object} story story object
 * @param {log} $ logging instance
 */
const convertStrings = (story, basenames, log) => {

  log.set('strings');

  let sStrings = [ // change rules
    { from: '<br>\\s*\\n', to: '<br/>' },
    { from: '([^>])\\n', to: `$1<br/>` },
    { from: '<br\/>$', to: '' },
    { from: '(<\/br>\n|<\/br>$|<\/br>)', to: '' },
    { from: '\\s+title=""', to: '' },
    {
      from: 'http://www\\.s522667522\\.online\\.de/public/',
      to: `${baseUrl}/cockpit/storage/uploads/`
    },
    {
      from: encodeURIComponent('http://www.s522667522.online.de/public/'),
      to: encodeURIComponent(`${baseUrl}/cockpit/storage/upload/`)
    }
  ];

  for (let s of sStrings) {
    let reg = new RegExp(s.from, 'gi');
    if (reg.test(story.body.content)) {
      story.body.content = story.body.content.replace(reg, s.to);
      log.item(story.fm.basename, s.from, s.to);
    }
  }

  log.set('internal link');

  // convert links
  let m = story.body.content.match(/https?:\/\/neonwilderness.twoday.net\/stories\/(.*?)["'<\s]/gi);
  if (m) {
    m.forEach(storyUrl => {
      let name = '';
      // cut off ending char
      storyUrl = storyUrl.substr(0, storyUrl.length - 1);
      // continue with a clone to save original
      let url = storyUrl;
      // check if jumper tag included
      let i = url.indexOf('#');
      // yes, then isolate
      if (i >= 0) {
        name = url.substr(i + 1); //jumptag without '#'
        url = url.substr(0, i);
        if (!isNaN(name)) name = 'comments'; // can't jump to individual comment-ids
        name = `#${name}`;
      }
      // eliminate potential last slash
      if (url[url.length - 1] === '/')
        url = url.substr(0, url.length - 1);
      // isolate story-id or -basename
      let storyId = url.split('/').pop();
      // check if id is numeric
      if (!isNaN(storyId)) {
        if (!storyId in basenames) {
          log.item(story.fm.basename, storyUrl, `Error: id ${storyId} not found in basenames lookup.`);
          return;
        }
        storyId = basenames[storyId];
        story.body.content = story.body.content.replace(
          RegExp(storyUrl, 'gi'),
          `/${storyId}${name}`
        );
        log.item(story.fm.basename, storyUrl, `/${storyId}${name}`);
      }
    });
  }

  return story.body.content;

};

module.exports = convertStrings;
