# Bitbucket mark-as-read

## Motivation

I'd like to mark commits that's I've personally reviewed as 'read',
without actually approving them globally.

I'd also like to see the same data in JIRA when looking at commits list.

To achieve that I wrote Chrome extension.  It uses Chrome storage API
for saving the read/unread data, so it can be shared between JIRA and
Bitbucket pages (which wouldn't be possible with simple user-script).

## Install

Just open chrome://extensions page, tick "Developer mode",
click "Load unpacked extension..." and browse for the dir of this script.
