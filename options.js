function saveOptions() {
    chrome.storage.sync.set({
        ignoredAuthors: document.getElementById('ignoredAuthors').value
    }, () => {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
            status.textContent = '';
        }, 750);
    });
}

function restoreOptions() {
    chrome.storage.sync.get({ignoredAuthors: ''}, items => {
        document.getElementById('ignoredAuthors').value = items.ignoredAuthors;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);

document.getElementById('save').addEventListener('click', saveOptions);
