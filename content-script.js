"use strict";

$(function(){
    var IGNORED_AUTHORS = [
        // Maven release plugin
        "Author not mapped to Bitbucket user.",
        "Anonymous",
        // Myself
        "Rene Saarsoo",
        // Backend devs
        "Neeme Praks",
        "Kaarel Kann",
        "raulv",
        "Raul Valge",
        "Erkki Lindpere",
        "Pavel Grigorenko",
        "Vasily Tsvetkov",
    ];

    function init() {
        // Commits list page
        $(".commit-list .iterable-item").each(function(){
            var tr = $(this);

            // Make commit bodies less annoying.
            tr.find("td.text .body").css("color", "#ddd");

            // Skip commits by certain authors
            var author = tr.find("td.user span[title]").attr("title");
            if (isIgnoredAuthor(author)) {
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
            var author = el.find(".author").text();
            if (isIgnoredAuthor(author)) {
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
                    if (isIgnoredAuthor(author)) {
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

    function isIgnoredAuthor(author) {
        return IGNORED_AUTHORS.indexOf(author) !== -1;
    }

    function containsMergeMarker(el) {
        return el.find(".aui-lozenge").length > 0;
    }

    function extractHash(url) {
        return url.replace(/#.*$/, "").replace(/\/$/, "").replace(/^.*\//, "").replace(/\?.*/, "");
    }

    function createLink(hash, callback) {
        var storageKey = "read-" + hash;

        var link = $("<a href='#read'></a>");
        link.data("key", storageKey);

        chrome.storage.local.get(storageKey, (obj) => {
            if (obj[storageKey]) {
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

        var storageObj = {};
        storageObj[link.data("key")] = true;
        chrome.storage.local.set(storageObj);
    });

    $("body").on("click", ".mark-as-read-ok", function(evt){
        evt.preventDefault();
        var link = $(evt.target);

        link.attr("class", "mark-as-read");
        link.text("unread");
        chrome.storage.local.remove(link.data("key"));
    });

    init();

    if ($(".branch-selector-pjax").length > 0) {
        // Refresh the read/unread links when commit list refreshed with Ajax
        var observer = new MutationObserver(init);
        observer.observe($(".branch-selector-pjax")[0], {childList: true});
    }

});
