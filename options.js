// Saves options to chrome.storage.sync.
function saveOptions() {
    chrome.storage.sync.set({
        ignoredAuthors: document.getElementById('ignoredAuthors').value
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        ignoredAuthors: ''
    }, function(items) {
        document.getElementById('ignoredAuthors').value = items.ignoredAuthors;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);

document.getElementById('save').addEventListener('click', saveOptions);
