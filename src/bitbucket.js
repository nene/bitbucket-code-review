import $ from "jquery";
import BitbucketMarkAsRead from "./BitbucketMarkAsRead";
import initDiffToggleButtons from "./initDiffToggleButtons";

$(() => {
    var bitbucket = new BitbucketMarkAsRead();
    bitbucket.run();
    initDiffToggleButtons();
});
