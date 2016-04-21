import $ from "jquery";
import JiraMarkAsRead from "./JiraMarkAsRead";

$(() => {
    var jira = new JiraMarkAsRead();
    jira.run();
});
