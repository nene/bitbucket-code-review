"use strict";

/**
 * Parses ignored authors list for settings,
 * providing the .contains() predicate for checking
 * if a particular author is in ignore list.
 */
var ignoredAuthors = {
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

/**
 * Manages storage of read and unread commits.
 */
var commitStore = {
    /**
     * Queries whether commit is read or not.
     * @param  {String}   hash
     * @param  {Function} callback  Called with true when commit is read.
     */
    isRead(hash, callback) {
        chrome.storage.local.get(hash, (obj) => {
            callback(obj[hash] && obj[hash].read);
        });
    },

    /**
     * Marks commit as read.
     * @param  {String}   hash
     */
    markAsRead(hash) {
        chrome.storage.local.set({
            [hash]: {read: true}
        });
    },

    /**
     * Marks commit as NOT read.
     * @param  {String}   hash
     */
    markAsUnread(hash) {
        chrome.storage.local.remove(hash);
    },
};

$(function(){

    function init() {
        // Commits list page
        $(".commit-list .iterable-item").each(function(){
            var tr = $(this);

            // Make commit bodies less annoying.
            tr.find("td.text .body").css("color", "#ddd");

            // Skip commits by certain authors
            var author = tr.find("td.user span[title]").attr("title");
            if (ignoredAuthors.contains(author)) {
                return;
            }

            // Skip merge commits
            if (containsMergeMarker(tr)) {
                return;
            }

            // extract the SHA hash of a commit
            var hash = extractHash(tr.find("a.hash").attr("href"));

            createLink(hash, (link) => {
                tr.find("td.text .subject").append(link);
            });
        });

        // Single commit page
        $(".commit-info .commit-header").each(function(){
            var el = $(this);
            // Skip commits by certain authors
            var author = el.find(".author[title]").text();
            if (ignoredAuthors.contains(author)) {
                return;
            }

            // Skip merge commits
            if (containsMergeMarker(el)) {
                return;
            }

            // extract the SHA hash of a commit
            var hash = extractHash(document.location.href);

            createLink(hash, (link) => {
                el.find(".changeset-hash").append(link);
            });
        });

        // JIRA commits list
        $("body").on("click", "#devstatus-container a.summary", () => {
            waitFor(".detail-commits-container", () => {
                $(".detail-commits-container .commitrow").each(function() {
                    // Skip commits by certain authors
                    var author = $(this).find(".author .extra-content-in-title").attr("original-title");
                    if (ignoredAuthors.contains(author)) {
                        return;
                    }

                    var hash = $(this).data("changesetid");
                    createLink(hash, (link) => {
                        $(this).find(".message .ellipsis").prepend(link);
                    });
                });
            });
        });
    }

    function waitFor(selector, callback) {
        function test() {
            if ($(selector).length > 0) {
                callback();
            }
            else {
                setTimeout(test, 100);
            }
        }
        test();
    }

    function containsMergeMarker(el) {
        return el.find(".aui-lozenge").length > 0;
    }

    function extractHash(url) {
        return url.replace(/#.*$/, "").replace(/\/$/, "").replace(/^.*\//, "").replace(/\?.*/, "");
    }

    function createLink(hash, callback) {
        var link = $("<a href='#read'></a>");
        link.data("key", hash);

        commitStore.isRead(hash, (read) => {
            if (read) {
                // This commit has been read.
                link.attr("class", "mark-as-read-ok");
                link.text("read");
            }
            else {
                // This commit has NOT been read yet.
                link.attr("class", "mark-as-read");
                link.text("unread");
            }

            callback(link);
        });
    }

    $("body").on("click", ".mark-as-read", function(evt){
        evt.preventDefault();
        var link = $(evt.target);

        link.attr("class", "mark-as-read-ok");
        link.text("read");

        commitStore.markAsRead(link.data("key"));
    });

    $("body").on("click", ".mark-as-read-ok", function(evt){
        evt.preventDefault();
        var link = $(evt.target);

        link.attr("class", "mark-as-read");
        link.text("unread");

        commitStore.markAsUnread(link.data("key"));
    });

    ignoredAuthors.load(() => {
        // Run init() after ignored authors settings loaded
        init();

        if ($(".branch-selector-pjax").length > 0) {
            // Refresh the read/unread links when commit list refreshed with Ajax
            var observer = new MutationObserver(init);
            observer.observe($(".branch-selector-pjax")[0], {childList: true});
        }
    });
});