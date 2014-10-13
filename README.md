# Bitbucket mark-as-read

## Motivation

I'd like to mark commits that's I've personally reviewed as 'read',
without actually approving them globally.

To achieve that I wrote a JavaScript snippet that you can paste into [Tampermonkey][].


## Quick Start

Grab the script from `bitbucket-mark-as-read.js`


## You Need More Help?

1. Install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
2. Open up Tampermonkey and create a new script
3. Copy paste the script from `bitbucket-mark-as-read.js` or
   link it with `@requires` from you userscript definition.
4. **Modify @include URL in the header to match your Bitbucket url**
5. Navigate to your Bitbucket commits and behold...

[Tampermonkey]: https://chrome.google.com/webstore/detail/tampermonkey/
