"use strict";

$(function(){
    var IGNORED_AUTHORS = [
        // Maven release plugin
        "Author not mapped to Bitbucket user.",
        "Anonymous",
        // Myself
        "Rene Saarsoo"
    ];

    $("head").append(
        "<style>" +
        ".mark-as-read, .mark-as-read-ok { " +
        "    color: white;" +
        "    border-radius: 10px;" +
        "    padding: 0 0.5em;" +
        "    font-family: Helvetica Neue, Helvetica, Arial, sans-serif;" +
        "    font-weight: 100;" +
        "    font-size: 12px;" +
        "    letter-spacing: 1px;" +
        "} " +
        ".mark-as-read { background-color: #DB4D4D; } " +
        ".mark-as-read-ok { background-color: #4DB870; } " +
        "</style>"
    );

    function init() {
        // Commits list page
        $(".commit-list .iterable-item").each(function(){
            var tr = $(this);
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

            var link = createLink(hash);
            tr.find("td.text > div").append(link);
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

            var link = createLink(hash);
            el.find(".changeset-hash").append(link);
        });
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

    function createLink(hash) {
        var localStorageKey = "read-" + hash;

        var link = $("<a href='#read'></a>");
        link.data("key", localStorageKey);

        if (localStorage.getItem(localStorageKey)) {
            // This commit has been read.
            link.attr("class", "mark-as-read-ok");
            link.text("read");
        }
        else {
            // This commit has NOT been read yet.
            link.attr("class", "mark-as-read");
            link.text("unread");
        }

        return link;
    }

    $("body").on("click", ".mark-as-read", function(evt){
        evt.preventDefault();
        var link = $(evt.target);

        link.attr("class", "mark-as-read-ok");
        link.text("read");
        localStorage.setItem(link.data("key"), true);
    });

    $("body").on("click", ".mark-as-read-ok", function(evt){
        evt.preventDefault();
        var link = $(evt.target);

        link.attr("class", "mark-as-read");
        link.text("unread");
        localStorage.removeItem(link.data("key"));
    });

    init();

    // Refresh the read/unread links when commit list refreshed with Ajax
    var observer = new MutationObserver(init);
    observer.observe($(".branch-selector-pjax")[0], {childList: true});

});
