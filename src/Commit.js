/**
 * Represents a single commit
 */
export default class {
    /**
     * Creates new commit object.
     * @param {String} hash
     * @param {Object} data
     */
    constructor(hash, data = {}) {
        this.hash = hash;
        this.data = data;
    }

    /**
     * Returns commit hash
     * @return {String}
     */
    getHash() {
        return this.hash;
    }

    /**
     * Returns commit data
     * @return {Object}
     */
    getData() {
        return this.data;
    }

    /**
     * True when commit has any content worth saving at all.
     * @return {Boolean}
     */
    hasData() {
        return this.data.read;
    }

    /**
     * True when commit has been read.
     * @return {Boolean}
     */
    isRead() {
        return this.data.read;
    }

    /**
     * Marks commit as read or unread.
     * @param {Boolean} read
     */
    setRead(read) {
        this.data.read = read;
        return this;
    }
}
