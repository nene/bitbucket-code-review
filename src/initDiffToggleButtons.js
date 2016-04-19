import $ from "jquery";
import commitStore from "./commitStore";
import extractCommitHashFromUrl from "./extractCommitHashFromUrl";

/**
 * Initializes show/hide buttons for each file in commit page.
 */
export default function() {
    var hash = extractCommitHashFromUrl(document.location.href);
    if (!hash) {
        return;
    }

    commitStore.load(hash, commit => {
        $(".diff-container").each(function(){
            addToggleButton($(this), commit);
        });
    });
}

function addToggleButton($diffContainer, commit) {
    $diffContainer.find(".diff-actions").prepend(
        createButtonGroup(
            createToggleButton($diffContainer, commit)
        )
    );
}

function createButtonGroup($button) {
    var $group = $("<div class='aui-buttons'></div>");
    $group.append($button);
    return $group;
}

function createToggleButton($diffContainer, commit) {
    var filename = $diffContainer.find("h1.filename").text().replace(/\bFile\b/, "").trim();
    var $contentToToggle = $diffContainer.find(".diff-content-container");

    var $button = $('<a href="#" class="aui-button aui-button-light" resolved=""></a>');
    $button.text(makeLinkText(commit.isFileVisible(filename)));
    if (!commit.isFileVisible(filename)) {
        $contentToToggle.hide();
    }

    $button.on("click", function(e) {
        e.preventDefault();

        commit.setFileVisible(filename, !commit.isFileVisible(filename));
        commitStore.save(commit);
        $button.text(makeLinkText(commit.isFileVisible()));
        $contentToToggle.toggle();
    });

    return $button;
}

function makeLinkText(fileVisible) {
    return fileVisible ? "Hide" : "Show";
}
