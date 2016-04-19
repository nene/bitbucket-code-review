import Commit from "./Commit";

/**
 * Manages storage of commits.
 */
export default {
    cache: {},

    /**
     * Loads commit with given hash.
     * @param {String}   hash
     * @param {Function} callback Invoked with loaded Commit object
     */
    load(hash, callback) {
        // Ensure we always use a same Commit instance for the same hash.
        //
        // This eliminates concurrency problems: e.g. where we ask for a commit
        // in two places, modify it separately and save the result.
        // Without a cache, this would result in last change overriding
        // previous changes.
        if (this.cache[hash] instanceof Commit) {
            callback(this.cache[hash]);
            return;
        }
        // When loading has been started but isn't finished yet,
        // we wait for the promise to finish.
        else if (this.cache[hash] instanceof Promise) {
            this.cache[hash].then(callback);
            return;
        }
        // Perform the actual loading of data.
        // Until not finished, store the promise to cache.
        else {
            this.cache[hash] = this.loadFromStorage(hash);
            this.cache[hash].then(callback);
        }
    },

    loadFromStorage(hash) {
        return new Promise((resolve) => {
            chrome.storage.local.get(hash, (data) => {
                this.cache[hash] = new Commit(hash, data[hash]);
                resolve(this.cache[hash]);
            });
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
