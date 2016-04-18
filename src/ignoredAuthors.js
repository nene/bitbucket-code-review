/**
 * Parses ignored authors list for settings,
 * providing the .contains() predicate for checking
 * if a particular author is in ignore list.
 */
export default {
    // Loads settings, invokes callback when done
    load(callback) {
        chrome.storage.sync.get({ignoredAuthors: ''}, cfg => {
            this.init(cfg.ignoredAuthors);
            callback();
        });
    },

    init(text) {
        this.authors = {};
        this.parse(text).forEach(name => {
            this.authors[name] = true;
        });
    },

    parse(text) {
        return text
            .split("\n")
            // eliminate comments and whitespace
            .map(s => s.replace(/\/\/.*/, "").trim())
            // eliminate empty lines
            .filter(s => s);
    },

    contains(name) {
        return this.authors[name];
    },
};
