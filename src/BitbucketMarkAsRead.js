import $ from "jquery";
import ignoredAuthors from "./ignoredAuthors";
import MarkAsReadLinks from "./MarkAsReadLinks";
import extractCommitHashFromUrl from "./extractCommitHashFromUrl";

/**
 * Handles mark-as-read functionality for commit links in JIRA.
 */
export default class {
    run() {
        this.markAsReadLinks = new MarkAsReadLinks();

        ignoredAuthors.load(() => {
            this.initCommitListPage();
            this.initCommitPage();

            if ($(".branch-selector-pjax").length > 0) {
                // Refresh the read/unread links when commit list refreshed with Ajax
                var observer = new MutationObserver(() => this.initCommitListPage());
                observer.observe($(".branch-selector-pjax")[0], {childList: true});
            }
        });
    }

    initCommitListPage() {
        $(".commit-list .iterable-item").each((index, trNode) => {
            var tr = $(trNode);

            // Make commit bodies less annoying.
            tr.find("td.text .body").css("color", "#ddd");

            // Skip commits by certain authors
            var author = tr.find("td.user span[title]").attr("title");
            if (ignoredAuthors.contains(author)) {
                return;
            }

            // Skip merge commits
            if (this.containsMergeMarker(tr)) {
                return;
            }

            // extract the SHA hash of a commit
            var hash = extractCommitHashFromUrl(tr.find("a.hash").attr("href"));

            this.markAsReadLinks.createLink(hash, (link) => {
                tr.find("td.text .subject").append(link);
            });
        });
    }

    initCommitPage() {
        $(".commit-info .commit-header").each((index, node) => {
            var el = $(node);
            // Skip commits by certain authors
            var author = el.find(".author[title]").text();
            if (ignoredAuthors.contains(author)) {
                return;
            }

            // Skip merge commits
            if (this.containsMergeMarker(el)) {
                return;
            }

            // extract the SHA hash of a commit
            var hash = extractCommitHashFromUrl(document.location.href);

            this.markAsReadLinks.createLink(hash, (link) => {
                el.find(".changeset-hash").append(link);
            });
        });
    }

    containsMergeMarker(el) {
        return el.find(".aui-lozenge").length > 0;
    }
}
