"use strict";

$(function(){
    var MYSELF = "Rene Saarsoo";

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

    // Commits list page
    $(".commit-list .iterable-item").each(function(){
        var tr = $(this);
        // Skip commits made by myself - no need to review my own stuff
        var author = tr.find("td.user span[title]").attr("title");
        if (author === MYSELF) {
            return;
        }

        // extract the SHA hash of a commit
        var hash = extractHash(tr.find("a.hash").attr("href"));

        var link = createLink(hash);
        tr.find("td.text > div").append(link);
    });

    // Single commit page
    $(".commit-info .commit-header").each(function(){
        // Skip commits made by myself - no need to review my own stuff
        var author = $(this).find(".author").text();
        if (author === MYSELF) {
            return;
        }

        // extract the SHA hash of a commit
        var hash = extractHash(document.location.href);

        var link = createLink(hash);
        $(this).find(".changeset-hash").append(link);
    });

    function extractHash(url) {
        return url.replace(/#.*$/, "").replace(/^.*\//, "");
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
});
