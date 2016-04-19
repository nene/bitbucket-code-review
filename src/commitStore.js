import Commit from "./Commit";

/**
 * Manages storage of commits.
 */
export default {
    /**
     * Loads commit with given hash.
     * @param {String}   hash
     * @param {Function} callback Invoked with loaded Commit object
     */
    load(hash, callback) {
        chrome.storage.local.get(hash, (data) => {
            callback(new Commit(hash, data[hash]));
        });
    },

    /**
     * Saves commit with given hash.
     * @param {Commit}  commit
     */
    save(commit) {
        if (commit.hasData()) {
            chrome.storage.local.set({
                [commit.getHash()]: commit.getData()
            });
        }
        else {
            chrome.storage.local.remove(commit.getHash());
        }
    },
};
