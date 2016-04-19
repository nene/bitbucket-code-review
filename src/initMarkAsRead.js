import $ from "jquery";
import ignoredAuthors from "./ignoredAuthors";
import commitStore from "./commitStore";
import extractCommitHashFromUrl from "./extractCommitHashFromUrl";

/**
 * Module that initializes read/unread links.
 */
export default function () {
    ignoredAuthors.load(() => {
        initLinks();
        initLinkEventHandlers();

        if ($(".branch-selector-pjax").length > 0) {
            // Refresh the read/unread links when commit list refreshed with Ajax
            var observer = new MutationObserver(initLinks);
            observer.observe($(".branch-selector-pjax")[0], {childList: true});
        }
    });
}

function initLinks() {
    initCommitListPage();
    initCommitPage();
    initJiraCommitList();
}

function initCommitListPage() {
    $(".commit-list .iterable-item").each(function() {
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
        var hash = extractCommitHashFromUrl(tr.find("a.hash").attr("href"));

        createLink(hash, (link) => {
            tr.find("td.text .subject").append(link);
        });
    });
}

function initCommitPage() {
    $(".commit-info .commit-header").each(function() {
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
        var hash = extractCommitHashFromUrl(document.location.href);

        createLink(hash, (link) => {
            el.find(".changeset-hash").append(link);
        });
    });
}

function initJiraCommitList() {
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

function initLinkEventHandlers() {
    $("body").on("click", ".mark-as-read", function(evt) {
        evt.preventDefault();
        var link = $(evt.target);

        link.attr("class", "mark-as-read-ok");
        link.text("read");

        markAsRead(link.data("key"), true);
    });

    $("body").on("click", ".mark-as-read-ok", function(evt) {
        evt.preventDefault();
        var link = $(evt.target);

        link.attr("class", "mark-as-read");
        link.text("unread");

        markAsRead(link.data("key"), false);
    });
}

function markAsRead(hash, read) {
    commitStore.load(hash, commit => {
        commitStore.save(commit.setRead(read));
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

function createLink(hash, callback) {
    var link = $("<a href='#read'></a>");
    link.data("key", hash);

    commitStore.load(hash, (commit) => {
        if (commit.isRead()) {
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
