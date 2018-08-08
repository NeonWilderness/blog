const escape = require('escape-goat').escape;
const fs = require('fs');
const path = require('path');

class logConversions {

  constructor() {
    this.html = 
     `<html lang="de">
      <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Foundation5 to Vuetify Conversion of blog stories</title>
          <style>
              body { background: #fff; color: #444; padding: 10px 20px; font-family: Tahoma, sans-serif; }
              #wrapper { width: 800px; margin: 0 auto; }
              h3 span { color: #27ae60; font-weight: normal; font-size: .9em; }
              .hint { font-size: .8em; background-color: #f5f5f5; border-top: 2px solid #666; border-bottom: 2px solid #666; padding: 10px; }
              .changeItem:nth-child(even) { background-color: #f5f5f5; }
              .changeItem:nth-child(odd) { background-color: #ffff; }
              pre { white-space: pre-wrap; }
              pre:before { font-weight: bold; text-decoration: underline; width: 5em; display: inline-block; }
              pre.before:before { content: "before:" }
              pre.after:before { content: "after:" }
              .basename { text-decoration: none; color: #008bca; }
              .basename span { color: #ccc; font-size: .85em; margin-left: 1em; }
          </style>
      </head>
      <body>
          <div id="wrapper">
              <h3>Log of all identified Foundation5 --> Vuetify conversion items</h3>
              <p class="hint">
                The following list contains all elements that have been changed during the 
                conversion process along with their before/after status.
              </p>
              {{items}}
          </div>
      </body>
      </html>
    `;
    this.sub = '';
    this.items = [];
  }

  dump(converted) {
    fs.writeFileSync(
      path.resolve(process.cwd(), 'data', 'logConversion.html'), 
      this.html.replace('{{items}}', this.items.join('\n'))
    );
    fs.writeFileSync(
      path.resolve(process.cwd(), 'data', 'logConverted.txt'), 
      converted
    );
  }

  item(basename, before, after) {
    this.items.push(`
    <div class="changeItem">
      <a class="basename" target="_blank" href="https://neonwilderness.twoday.net/stories/${basename.split('-').pop()}">${basename} <span>${this.sub}</span></a>
      <pre class="before"><code>${escape(before)}</code></pre>
      <pre class="after"><code>${escape(after)}</code></pre>
    </div>
    `
    );
  }

  set(sub) {
    this.sub = sub;
  }

}

module.exports = logConversions;
