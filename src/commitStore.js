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
     * Saves data inside commit.
     *
     * When commit has no data, deletes it from storage instead.
     * So we only use the minimum amount of storage.
     *
     * @param {Commit}  commit
     */
    save(commit) {
        var data = commit.getData();

        if (Object.keys(data).length > 0) {
            chrome.storage.local.set({
                [commit.getHash()]: data
            });
        }
        else {
            chrome.storage.local.remove(commit.getHash());
        }
    },
};
