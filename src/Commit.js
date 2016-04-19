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
        this.read = !!data.read;

        this.hiddenFilesMap = {};
        (data.hiddenFiles || []).forEach(fname => {
            this.hiddenFilesMap[fname] = true;
        });
    }

    /**
     * Returns commit hash
     * @return {String}
     */
    getHash() {
        return this.hash;
    }

    /**
     * Returns commit data (cleaned up for saving)
     * @return {Object}
     */
    getData() {
        var data = {};

        if (this.read) {
            data.read = this.read;
        }

        var hiddenFiles = this.getHiddenFiles();
        if (hiddenFiles.length > 0) {
            data.hiddenFiles = hiddenFiles;
        }

        return data;
    }

    /**
     * True when commit has any content worth saving at all.
     * @return {Boolean}
     */
    hasData() {
        return Object.keys(this.getData()).length > 0;
    }

    /**
     * True when commit has been read.
     * @return {Boolean}
     */
    isRead() {
        return this.read;
    }

    /**
     * Marks commit as read or unread.
     * @param {Boolean} read
     */
    setRead(read) {
        this.read = read;
        return this;
    }

    /**
     * True when the specified file is visible
     * @param  {String}  filename
     */
    isFileVisible(filename) {
        return !this.hiddenFilesMap[filename];
    }

    /**
     * Marks files as visible or not visible.
     * @param {String} filename
     * @param {Booleab} visible
     */
    setFileVisible(filename, visible) {
        this.hiddenFilesMap[filename] = !visible;
        return this;
    }

    // Returns array of only hidden files (excluding the visible files)
    getHiddenFiles() {
        return Object.keys(this.hiddenFilesMap).filter(fname => this.hiddenFilesMap[fname]);
    }
}
