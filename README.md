# Bitbucket Code Review

Mark-as-read functionality for commits and parts of commits
in Bitbucket and JIRA.

- Mark commits as read/unread in both Bitbucket and JIRA
- Hide reviewed file diffs in bitbucket commit page
- Ignore commits of specified authors (configured in options)

## Motivation

During code review I'd like to mark parts of it as read,
so I can remember that I've already read through particular
commits or parts of these commits.

Bitbucket has the ability to approve commits, that's a globally visible action.
I'd only like to mark-as-read for my private use.

## Solution

To achieve that I wrote Chrome extension.  It uses Chrome storage API
for saving the read/unread data, so it can be shared between JIRA and
Bitbucket pages (which wouldn't be possible with simple user-script).

## Development setup

To install all dependencies:

    $ npm install

To continuously compile while developing, start watch mode:

    $ npm run watch

Open chrome://extensions page, tick "Developer mode",
click "Load unpacked extension..." and browse for the repository directory.

To package up for Chrome Web Store upload:

    $ npm run package
