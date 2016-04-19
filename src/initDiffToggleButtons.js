import $ from "jquery";

/**
 * Initializes show/hide buttons for each file in commit page.
 */
export default function() {
    $(".diff-container").each(function(){
        addToggleButton($(this));
    });
}

function addToggleButton($diffContainer) {
    $diffContainer.find(".diff-actions").prepend(
        createButtonGroup(
            createToggleButton($diffContainer.find(".diff-content-container"))
        )
    );
}

function createButtonGroup($button) {
    var $group = $("<div class='aui-buttons'></div>");
    $group.append($button);
    return $group;
}

function createToggleButton($contentToToggle) {
    var $button = $('<a href="#" class="aui-button aui-button-light" resolved="">Hide</a>');

    $button.on("click", function(e) {
        e.preventDefault();
        $contentToToggle.toggle();
        $button.text($button.text() === "Hide" ? "Show" : "Hide");
    });

    return $button;
}
