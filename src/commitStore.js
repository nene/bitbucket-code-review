/**
 * Manages storage of read and unread commits.
 */
export default {
    /**
     * Queries whether commit is read or not.
     * @param  {String}   hash
     * @param  {Function} callback  Called with true when commit is read.
     */
    isRead(hash, callback) {
        chrome.storage.local.get(hash, (obj) => {
            callback(obj[hash] && obj[hash].read);
        });
    },

    /**
     * Marks commit as read.
     * @param  {String}   hash
     */
    markAsRead(hash) {
        chrome.storage.local.set({
            [hash]: {read: true}
        });
    },

    /**
     * Marks commit as NOT read.
     * @param  {String}   hash
     */
    markAsUnread(hash) {
        chrome.storage.local.remove(hash);
    },
};
