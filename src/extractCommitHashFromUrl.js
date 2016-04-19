/**
 * Given Bitbucket commit URL, returns hash.
 * @param  {String} url
 * @return {String}
 */
export default function(url) {
    var [, hash] = url.match(/^.*\/([a-fA-F0-9]+)\/?(\?.*)?(#.*)?$/) || [];
    return hash;
}
