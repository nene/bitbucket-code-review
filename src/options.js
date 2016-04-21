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

function showStats() {
    chrome.storage.local.getBytesInUse(null, bytes => {
        chrome.storage.local.get(null, allItems => {
            var size = (bytes >= 1024) ? `${Math.round(bytes / 1024)} KiB` : `${bytes} bytes`;
            var count = Object.keys(allItems).length;
            document.getElementById('stats').textContent =
                `Total ${size} used to store ${count} read commits.`;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    restoreOptions();
    showStats();
});

document.getElementById('save').addEventListener('click', saveOptions);
