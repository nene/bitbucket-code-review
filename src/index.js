import $ from "jquery";
import initMarkAsRead from "./initMarkAsRead";
import initDiffToggleButtons from "./initDiffToggleButtons";

$(() => {
    initMarkAsRead();
    initDiffToggleButtons();
});
