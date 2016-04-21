import $ from "jquery";
import ignoredAuthors from "./ignoredAuthors";
import MarkAsReadLinks from "./MarkAsReadLinks";
import commitStore from "./commitStore";

/**
 * Handles mark-as-read functionality for commit links in JIRA.
 */
export default class {
    run() {
        this.markAsReadLinks = new MarkAsReadLinks();

        ignoredAuthors.load(() => {
            this.initCommitList();
        });
    }

    initCommitList() {
        $("body").on("click", "#devstatus-container a.summary", () => {
            this.waitFor(".detail-commits-container", () => {
                // Clear cache to be able to retrieve updated data for commits.
                commitStore.clearCache();

                $(".detail-commits-container .commitrow").each((index, node) => {
                    var el = $(node);

                    // Skip commits by certain authors
                    var author = el.find(".author .extra-content-in-title").attr("original-title");
                    if (ignoredAuthors.contains(author)) {
                        return;
                    }

                    var hash = el.data("changesetid");
                    this.markAsReadLinks.createLink(hash, (link) => {
                        el.find(".message .ellipsis").prepend(link);
                    });
                });
            });
        });
    }

    waitFor(selector, callback) {
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
}
