import $ from "jquery";
import ignoredAuthors from "./ignoredAuthors";
import commitStore from "./commitStore";

/**
 * Handles creation of mark-as-read links.
 */
export default class {
    /**
     * Initialization registers global click handler for mark-as-read links.
     */
    constructor() {
        $("body").on("click", ".mark-as-read", (evt) => {
            evt.preventDefault();
            var link = $(evt.target);

            link.attr("class", "mark-as-read-ok");
            link.text("read");

            this.markAsRead(link.data("key"), true);
        });

        $("body").on("click", ".mark-as-read-ok", (evt) => {
            evt.preventDefault();
            var link = $(evt.target);

            link.attr("class", "mark-as-read");
            link.text("unread");

            this.markAsRead(link.data("key"), false);
        });
    }

    markAsRead(hash, read) {
        commitStore.load(hash, commit => {
            commitStore.save(commit.setRead(read));
        });
    }

    /**
     * Creates mark-as-read link for a commit.
     * @param  {String}   hash Commit hash
     * @param  {Function} callback Gets invoked with the jQuery link element
     */
    createLink(hash, callback) {
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
}
